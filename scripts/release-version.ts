import { spawnSync } from "node:child_process"

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run("bun", ["run", "changeset", "version"])
run("bun", ["install", "--lockfile-only"])
