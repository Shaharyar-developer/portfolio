import { requireUser } from "@/lib/auth/session";
import { getUserGoogleClients } from "@/lib/google/server-client";
import { jsonError } from "@/lib/http";
import { readSheetPreview } from "@workspace/google";
import { NextResponse } from "next/server";

function columnLetter(index: number) {
  let value = index + 1;
  let column = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }

  return column;
}

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    const spreadsheetId = url.searchParams.get("spreadsheetId");
    const sheetTitle = url.searchParams.get("sheetTitle");
    const rawHeaderRowIndex = Number(url.searchParams.get("headerRowIndex") ?? "1");
    const headerRowIndex =
      Number.isFinite(rawHeaderRowIndex) && rawHeaderRowIndex > 0
        ? Math.floor(rawHeaderRowIndex)
        : 1;

    if (!spreadsheetId || !sheetTitle) {
      throw new Error("spreadsheetId and sheetTitle are required.");
    }

    const { sheets } = await getUserGoogleClients(user.id);
    const rows = await readSheetPreview({
      sheets,
      spreadsheetId,
      sheetTitle,
      rows: Math.max(20, headerRowIndex + 10),
    });
    const normalizedRows = rows.map((row) =>
      row.map((cell) => String(cell ?? "")),
    );
    const header = normalizedRows[headerRowIndex - 1] ?? [];
    const maxColumns = Math.max(
      header.length,
      ...normalizedRows.slice(0, 10).map((row) => row.length),
      4,
    );
    const columns = Array.from({ length: maxColumns }, (_value, index) => ({
      value: columnLetter(index),
      label: `${columnLetter(index)}${header[index] ? ` - ${header[index]}` : ""}`,
      header: header[index] ?? "",
    }));

    return NextResponse.json({
      rows: normalizedRows.slice(0, 10),
      columns,
    });
  } catch (error) {
    return jsonError(error, 400);
  }
}
