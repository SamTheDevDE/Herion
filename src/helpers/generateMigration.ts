import { execSync } from "node:child_process";
import dateFormat from "dateformat";

const now = new Date() as Date;
const migrationName = dateFormat(now, "yyyy-mm-dd_HH-MM-ss");

execSync(`bunx prisma migrate dev --name ${migrationName}`, {
  stdio: "inherit",
  cwd: process.cwd(),
});