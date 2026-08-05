import AgentWorkspacePage from "@/components/blocks/agent-workspace-01/page"

export const blockPreviews = {
  "agent-workspace-01": AgentWorkspacePage,
} as const

export function getBlockPreview(name: string) {
  return blockPreviews[name as keyof typeof blockPreviews]
}
