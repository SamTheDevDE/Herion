import { execSync } from "node:child_process";
import dateFormat from "dateformat";
// gets the current date
const now = new Date() as Date;
// formats it to a usable format for prisma
const migrationName = dateFormat(now, "yyyy-mm-dd_HH-MM-ss");
// starts a migration
execSync(`bunx prisma migrate dev --name ${migrationName}`, {
  stdio: "inherit",
  cwd: process.cwd(),
});