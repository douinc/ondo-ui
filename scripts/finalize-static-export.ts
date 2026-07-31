import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const outDir = resolve("out")

await mkdir(outDir, { recursive: true })
await writeFile(resolve(outDir, ".nojekyll"), "")
