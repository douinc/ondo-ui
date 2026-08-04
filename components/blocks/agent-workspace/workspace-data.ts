export type WorkspaceStatus = "start" | "running" | "complete"
export type WorkspaceTaskStatus = "idle" | "running" | "complete"
export type WorkspacePlanStepStatus = "queued" | "running" | "complete"

export type WorkspaceMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type WorkspaceTask = {
  id: string
  title: string
  description: string
  status: WorkspaceTaskStatus
}

export type WorkspacePlanStep = {
  id: string
  label: string
  detail: string
  status: WorkspacePlanStepStatus
}

export type WorkspaceArtifact = {
  id: string
  name: string
  description: string
  meta: string
  kind: "design" | "data" | "document" | "code"
}

export type WorkspaceMetric = {
  label: string
  value: string
}

export type WorkspaceSnapshot = {
  status: WorkspaceStatus
  project: {
    id: string
    name: string
    description: string
  }
  tasks: WorkspaceTask[]
  selectedTaskId: string
  messages: WorkspaceMessage[]
  plan: WorkspacePlanStep[]
  contextFiles: WorkspaceArtifact[]
  changedFiles: WorkspaceArtifact[]
  deliverables: WorkspaceArtifact[]
  progress?: number
  currentAction?: string
  completion?: {
    title: string
    body: string
    metrics: WorkspaceMetric[]
    verification: string
  }
  composerPlaceholder: string
}

const productExperienceProject = {
  id: "product-experience",
  name: "Product Experience",
  description: "제품 경험을 더 단순하고 명확하게 만드는 작업 공간",
}

const contextFiles: WorkspaceArtifact[] = [
  {
    id: "onboarding-flow-design",
    name: "onboarding-flow.fig",
    description: "현재 온보딩 화면 설계",
    meta: "Figma · 2.4 MB",
    kind: "design",
  },
  {
    id: "onboarding-funnel-data",
    name: "funnel-data.csv",
    description: "최근 30일 전환 데이터",
    meta: "CSV · 84 KB",
    kind: "data",
  },
  {
    id: "research-notes",
    name: "research-notes.pdf",
    description: "사용자 인터뷰 요약",
    meta: "PDF · 1.1 MB",
    kind: "document",
  },
]

const changedFiles: WorkspaceArtifact[] = [
  {
    id: "onboarding-flow-code",
    name: "onboarding-flow.tsx",
    description: "첫 화면과 선택 단계 재구성",
    meta: "변경됨 · 18 KB",
    kind: "code",
  },
  {
    id: "funnel-analysis",
    name: "funnel-analysis.md",
    description: "이탈 구간과 개선 가설",
    meta: "새 파일 · 9 KB",
    kind: "document",
  },
]

const deliverables: WorkspaceArtifact[] = [
  ...changedFiles,
  {
    id: "implementation-plan",
    name: "implementation-plan.md",
    description: "단계별 적용 계획과 검증 기준",
    meta: "완료 · 12 KB",
    kind: "document",
  },
]

const startTasks: WorkspaceTask[] = [
  {
    id: "onboarding-improvement",
    title: "온보딩 흐름 개선",
    description: "첫 사용 경험의 선택 부담 줄이기",
    status: "idle",
  },
  {
    id: "activation-research",
    title: "활성화 리서치 정리",
    description: "핵심 행동 전환 신호 모으기",
    status: "idle",
  },
  {
    id: "pricing-page-review",
    title: "가격 페이지 리뷰",
    description: "요금제 비교 흐름 점검하기",
    status: "idle",
  },
]

const runningTasks: WorkspaceTask[] = startTasks.map((task) =>
  task.id === "onboarding-improvement"
    ? { ...task, status: "running" }
    : task
)

const completeTasks: WorkspaceTask[] = startTasks.map((task) =>
  task.id === "onboarding-improvement"
    ? { ...task, status: "complete" }
    : task
)

const runningMessages: WorkspaceMessage[] = [
  {
    id: "running-user-goal",
    role: "user",
    content: "온보딩 흐름을 분석하고 개선안을 구현해줘",
  },
  {
    id: "running-agent-update",
    role: "assistant",
    content:
      "현재 이탈이 가장 큰 선택 단계를 확인했습니다. 핵심 행동을 더 앞에 배치하는 흐름을 작성하고 있습니다.",
  },
]

const completeMessages: WorkspaceMessage[] = [
  ...runningMessages,
  {
    id: "complete-agent-summary",
    role: "assistant",
    content:
      "초기 선택 단계를 4개에서 2개로 줄이고, 첫 핵심 행동 전에 제품 가치를 확인할 수 있도록 흐름을 재구성했습니다.",
  },
]

const runningPlan: WorkspacePlanStep[] = [
  {
    id: "analyze-current-flow",
    label: "현재 흐름 분석",
    detail: "화면별 진입과 이탈 지점을 확인했습니다.",
    status: "complete",
  },
  {
    id: "analyze-funnel",
    label: "퍼널 데이터 분석",
    detail: "첫 선택 단계의 이탈 패턴을 비교했습니다.",
    status: "complete",
  },
  {
    id: "author-improved-flow",
    label: "개선 흐름 작성",
    detail: "핵심 행동을 앞당기는 새 화면 구조를 작성 중입니다.",
    status: "running",
  },
  {
    id: "prototype-and-report",
    label: "프로토타입과 보고서",
    detail: "변경 화면과 분석 결과를 정리합니다.",
    status: "queued",
  },
  {
    id: "verify-results",
    label: "결과 검증",
    detail: "정의한 검증 항목을 순서대로 확인합니다.",
    status: "queued",
  },
]

const completePlan: WorkspacePlanStep[] = runningPlan.map((step) => ({
  ...step,
  status: "complete",
}))

export const workspaceSnapshots = {
  start: {
    status: "start",
    project: productExperienceProject,
    tasks: startTasks,
    selectedTaskId: "onboarding-improvement",
    messages: [],
    plan: [],
    contextFiles,
    changedFiles: [],
    deliverables: [],
    composerPlaceholder: "추가 요청을 입력하세요…",
  },
  running: {
    status: "running",
    project: productExperienceProject,
    tasks: runningTasks,
    selectedTaskId: "onboarding-improvement",
    messages: runningMessages,
    plan: runningPlan,
    contextFiles,
    changedFiles,
    deliverables: [],
    progress: 64,
    currentAction:
      "첫 화면의 선택 부담을 줄이고 핵심 행동을 앞당기는 새 흐름을 작성 중입니다.",
    composerPlaceholder: "추가 지시를 입력하세요…",
  },
  complete: {
    status: "complete",
    project: productExperienceProject,
    tasks: completeTasks,
    selectedTaskId: "onboarding-improvement",
    messages: completeMessages,
    plan: completePlan,
    contextFiles,
    changedFiles,
    deliverables,
    progress: 100,
    completion: {
      title: "온보딩 개선안을 완료했습니다",
      body:
        "초기 선택 단계를 4개에서 2개로 줄이고, 첫 핵심 행동 전에 제품 가치를 확인할 수 있도록 흐름을 재구성했습니다.",
      metrics: [
        { label: "선택 단계", value: "−2" },
        { label: "산출물", value: "3" },
        { label: "검증 항목", value: "12" },
      ],
      verification: "12/12",
    },
    composerPlaceholder: "결과를 수정하거나 다음 작업을 요청하세요…",
  },
} satisfies Record<WorkspaceStatus, WorkspaceSnapshot>

export function selectWorkspaceItem<T extends { id: string }>(
  items: readonly T[],
  requestedId: string | undefined
): T | undefined {
  return items.find((item) => item.id === requestedId) ?? items[0]
}

export function getVisibleArtifacts(
  snapshot: WorkspaceSnapshot
): WorkspaceArtifact[] {
  if (snapshot.status === "start") return snapshot.contextFiles
  if (snapshot.status === "running") return snapshot.changedFiles
  return snapshot.deliverables
}
