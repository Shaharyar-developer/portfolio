import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import type { Readable } from "stream";
import { google, type drive_v3, type sheets_v4 } from "googleapis";

export const GOOGLE_SHEETS_MIME_TYPE =
  "application/vnd.google-apps.spreadsheet";
export const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const SHEETDUE_GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
] as const;

export type GoogleTokenSet = {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  expiry_date?: number | null;
  id_token?: string | null;
};

export type SheetTab = {
  sheetId: number;
  title: string;
};

export type SpreadsheetMetadata = {
  spreadsheetId: string;
  title: string;
  timezone: string;
  sheets: SheetTab[];
};

export type DriveSpreadsheet = {
  id: string;
  name: string;
  mimeType: string;
  kind: "google_sheet" | "excel";
  modifiedTime?: string;
  webViewLink?: string;
  convertedFromFileId?: string;
};

function getOAuthClient(redirectUri: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  );
}

function encryptionKey() {
  const key = process.env.TOKEN_ENCRYPTION_KEY;

  if (!key) {
    throw new Error("TOKEN_ENCRYPTION_KEY is required for Google tokens.");
  }

  const buffer = Buffer.from(key, key.length === 64 ? "hex" : "base64");

  if (buffer.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to 32 bytes.");
  }

  return buffer;
}

export function encryptToken(value?: string | null) {
  if (!value) {
    return null;
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
}

export function hasUsableRefreshToken(input: {
  refreshToken?: string | null;
  existingEncryptedRefreshToken?: string | null;
}) {
  return Boolean(input.refreshToken || input.existingEncryptedRefreshToken);
}

export function decryptToken(value?: string | null) {
  if (!value) {
    return null;
  }

  const [ivPart, tagPart, encryptedPart] = value.split(".");

  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error("Encrypted token is malformed.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function buildGoogleOAuthUrl(input: {
  redirectUri: string;
  state: string;
}) {
  const client = getOAuthClient(input.redirectUri);

  return client.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: [...SHEETDUE_GOOGLE_SCOPES],
    state: input.state,
  });
}

export async function exchangeGoogleCode(input: {
  code: string;
  redirectUri: string;
}) {
  const client = getOAuthClient(input.redirectUri);
  const { tokens } = await client.getToken(input.code);
  return tokens as GoogleTokenSet;
}

export function createGoogleOAuthClient(input: {
  redirectUri: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiryDate?: Date | null;
}) {
  const client = getOAuthClient(input.redirectUri);
  client.setCredentials({
    access_token: input.accessToken ?? undefined,
    refresh_token: input.refreshToken ?? undefined,
    expiry_date: input.expiryDate?.getTime(),
  });
  return client;
}

export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to read Google profile.");
  }

  const json = (await response.json()) as {
    sub?: string;
    email?: string;
  };

  if (!json.sub || !json.email) {
    throw new Error("Google profile did not include account id and email.");
  }

  return {
    googleAccountId: json.sub,
    email: json.email,
  };
}

export function createSheetsClient(
  auth: ReturnType<typeof createGoogleOAuthClient>,
) {
  return google.sheets({ version: "v4", auth });
}

export function createDriveClient(
  auth: ReturnType<typeof createGoogleOAuthClient>,
) {
  return google.drive({ version: "v3", auth });
}

function escapeDriveQuery(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function searchDriveSpreadsheets(input: {
  drive: drive_v3.Drive;
  query?: string;
  pageSize?: number;
}) {
  const searchTerm = input.query?.trim();
  const qParts = [
    `mimeType = '${GOOGLE_SHEETS_MIME_TYPE}' or mimeType = '${XLSX_MIME_TYPE}'`,
    "trashed = false",
    searchTerm ? `name contains '${escapeDriveQuery(searchTerm)}'` : null,
  ].filter((part): part is string => Boolean(part));
  const q = qParts
    .map((part, index) => (index === 0 ? `(${part})` : part))
    .join(" and ");

  const response = await input.drive.files.list({
    q,
    pageSize: input.pageSize ?? 10,
    orderBy: "modifiedTime desc",
    fields: "files(id,name,mimeType,modifiedTime,webViewLink)",
    spaces: "drive",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  return (
    response.data.files?.flatMap((file) => {
      if (!file.id || !file.name || !file.mimeType) {
        return [];
      }

      return [
        {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          kind: file.mimeType === XLSX_MIME_TYPE ? "excel" : "google_sheet",
          modifiedTime: file.modifiedTime ?? undefined,
          webViewLink: file.webViewLink ?? undefined,
        } satisfies DriveSpreadsheet,
      ];
    }) ?? []
  );
}

function stripExcelExtension(name: string) {
  return name.replace(/\.xlsx$/i, "");
}

export async function importExcelFileAsGoogleSheet(input: {
  drive: drive_v3.Drive;
  fileId: string;
}) {
  const metadata = await input.drive.files.get({
    fileId: input.fileId,
    fields: "id,name,mimeType",
    supportsAllDrives: true,
  });

  if (metadata.data.mimeType !== XLSX_MIME_TYPE) {
    throw new Error("Only .xlsx Excel workbooks can be imported.");
  }

  const mediaResponse = await input.drive.files.get(
    {
      fileId: input.fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "stream",
    },
  );
  const sourceName = metadata.data.name ?? "Excel workbook";
  const importedName = `${stripExcelExtension(sourceName)} (SheetDue copy)`;

  const created = await input.drive.files.create({
    requestBody: {
      name: importedName,
      mimeType: GOOGLE_SHEETS_MIME_TYPE,
      appProperties: {
        sheetdueSourceFileId: input.fileId,
        sheetdueSourceMimeType: XLSX_MIME_TYPE,
      },
    },
    media: {
      mimeType: XLSX_MIME_TYPE,
      body: mediaResponse.data as unknown as Readable,
    },
    fields: "id,name,mimeType,modifiedTime,webViewLink",
    supportsAllDrives: true,
  });

  if (!created.data.id || !created.data.name) {
    throw new Error("Google Drive did not return the imported spreadsheet.");
  }

  return {
    id: created.data.id,
    name: created.data.name,
    mimeType: created.data.mimeType ?? GOOGLE_SHEETS_MIME_TYPE,
    kind: "google_sheet",
    modifiedTime: created.data.modifiedTime ?? undefined,
    webViewLink: created.data.webViewLink ?? undefined,
    convertedFromFileId: input.fileId,
  } satisfies DriveSpreadsheet;
}

export async function getSpreadsheetMetadata(input: {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
}) {
  const response = await input.sheets.spreadsheets.get({
    spreadsheetId: input.spreadsheetId,
    fields:
      "spreadsheetId,properties(title,timeZone),sheets(properties(sheetId,title))",
  });

  return {
    spreadsheetId: response.data.spreadsheetId ?? input.spreadsheetId,
    title: response.data.properties?.title ?? "Untitled spreadsheet",
    timezone: response.data.properties?.timeZone ?? "UTC",
    sheets:
      response.data.sheets
        ?.map((sheet) => sheet.properties)
        .filter((properties): properties is NonNullable<typeof properties> =>
          Boolean(properties?.sheetId != null && properties.title),
        )
        .map((properties) => ({
          sheetId: properties.sheetId ?? 0,
          title: properties.title ?? "Sheet",
        })) ?? [],
  } satisfies SpreadsheetMetadata;
}

export async function readSheetPreview(input: {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
  sheetTitle: string;
  rows?: number;
}) {
  const rows = input.rows ?? 20;
  const response = await input.sheets.spreadsheets.values.get({
    spreadsheetId: input.spreadsheetId,
    range: `'${input.sheetTitle.replaceAll("'", "''")}'!A1:ZZ${rows}`,
    valueRenderOption: "FORMATTED_VALUE",
  });

  return response.data.values ?? [];
}

export async function ensureStableRowIds(input: {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
  sheetId: number;
  sheetTitle: string;
  rows: string[][];
  stableColumnName: string;
}) {
  const header = input.rows[0] ?? [];
  let columnIndex = header.findIndex(
    (value) => value.trim().toLowerCase() === input.stableColumnName,
  );

  if (columnIndex === -1) {
    columnIndex = header.length;
  }

  const values = [
    [input.stableColumnName],
    ...input.rows.slice(1).map((row) => [row[columnIndex] || crypto.randomUUID()]),
  ];
  const columnLetter = columnIndexToLetter(columnIndex);

  await input.sheets.spreadsheets.values.update({
    spreadsheetId: input.spreadsheetId,
    range: `'${input.sheetTitle.replaceAll("'", "''")}'!${columnLetter}1:${columnLetter}${values.length}`,
    valueInputOption: "RAW",
    requestBody: {
      majorDimension: "ROWS",
      values,
    },
  });

  await input.sheets.spreadsheets.batchUpdate({
    spreadsheetId: input.spreadsheetId,
    requestBody: {
      requests: [
        {
          updateDimensionProperties: {
            range: {
              sheetId: input.sheetId,
              dimension: "COLUMNS",
              startIndex: columnIndex,
              endIndex: columnIndex + 1,
            },
            properties: {
              hiddenByUser: true,
            },
            fields: "hiddenByUser",
          },
        },
      ],
    },
  });

  return input.rows.map((row, index) => {
    const nextRow = [...row];
    nextRow[columnIndex] = values[index]?.[0] ?? crypto.randomUUID();
    return nextRow;
  });
}

function columnIndexToLetter(index: number) {
  let value = index + 1;
  let column = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }

  return column;
}

export function buildPickerConfig() {
  return {
    apiKey: process.env.GOOGLE_PICKER_API_KEY ?? "",
    scopes: [...SHEETDUE_GOOGLE_SCOPES],
  };
}
