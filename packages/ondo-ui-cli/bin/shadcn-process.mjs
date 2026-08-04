import { spawnSync as nodeSpawnSync } from "node:child_process"

export function buildShadcnCommandArgs(command, args = []) {
  return [command, ...args]
}

export function runShadcn(command, args = [], options = {}) {
  const spawnSync = options.spawnSync ?? nodeSpawnSync
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--yes", "shadcn@latest", ...buildShadcnCommandArgs(command, args)],
    {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      stdio: "inherit",
    }
  )

  if (result.error) throw result.error
  return result.status ?? 1
}
