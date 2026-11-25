import * as fs from "node:fs";
import * as path from "node:path";

const LINE =
  "fix: added a retry loop so the failure happens three times faster";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (
  LINE.length < 1 ||
  LINE.length > 100 ||
  LINE.trim().length === 0 ||
  LINE.includes("\n")
) {
  console.error("entry fails the gate: must be 1-100 non-whitespace characters, one line");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), LINE, "utf8");

// Byte-length assertion: exact ties break on bytes, so the entry must be
// exactly the 65 bytes measured at build time — no more, no less.
const written = fs.readFileSync(path.join(outDir, "entry.txt"), "utf8");
if (written !== LINE) {
  console.error("read-back mismatch: entry.txt differs from the entry line");
  process.exit(1);
}
if (Buffer.byteLength(written, "utf8") !== 65) {
  console.error("byte-length mismatch: expected 65 bytes");
  process.exit(1);
}
