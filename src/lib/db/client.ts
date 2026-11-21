import { neon } from "@neondatabase/serverless";

export type SqlClient = ReturnType<typeof neon>;

let cachedClient: SqlClient | null = null;

/**
 * Return a singleton Neon serverless SQL client bound to DATABASE_URL.
 */
export function getDbClient(): SqlClient {
  if (cachedClient) {
    return cachedClient;
  }
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required.");
  }
  cachedClient = neon(databaseUrl);
  return cachedClient;
}
