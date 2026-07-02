export function isLocalDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isBearerSecretAuthorized(input: {
  authorizationHeader: string | null;
  secret?: string | null;
  allowMissingSecretInDevelopment?: boolean;
}) {
  if (!input.secret) {
    return Boolean(
      input.allowMissingSecretInDevelopment && isLocalDevelopment(),
    );
  }

  return input.authorizationHeader === `Bearer ${input.secret}`;
}
