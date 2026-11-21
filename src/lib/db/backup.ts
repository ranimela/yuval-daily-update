import fs from "node:fs/promises";
import path from "node:path";
import { getDbClient } from "@/lib/db/client";

/**
 * Export a timestamped JSON snapshot of feed_items and source_health to /.backup/.
 */
export async function backupDatabaseToJson(): Promise<string> {
  const sql = getDbClient();
  const [feedItems, sourceHealth] = await Promise.all([
    sql`SELECT * FROM feed_items ORDER BY edition_date DESC, published_at DESC`,
    sql`SELECT * FROM source_health ORDER BY source_id`,
  ]);

  const backupDir = path.join(process.cwd(), ".backup");
  await fs.mkdir(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(backupDir, `neon-snapshot-${stamp}.json`);

  await fs.writeFile(
    outPath,
    JSON.stringify({ exportedAt: new Date().toISOString(), feedItems, sourceHealth }, null, 2),
    "utf8"
  );
  return outPath;
}

if (require.main === module) {
  backupDatabaseToJson()
    .then((outPath) => {
      console.info(`Backup saved to ${outPath}`);
    })
    .catch((err) => {
      console.error("Backup failed:", err);
      process.exitCode = 1;
    });
}
