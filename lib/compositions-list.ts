/**
 * Compositions documented on the site. Keep in sync with
 * content/docs/compositions/ and registry.json items of type
 * registry:component (excluding infrastructure like theme-provider).
 */
export const compositionsList = [
  {
    name: "empty-view",
    title: "EmptyView",
    description: {
      en: "A ready-made empty state composed from Empty and Button.",
      ko: "Empty와 Button으로 미리 조합한 빈 상태 컴포넌트입니다.",
    },
  },
  {
    name: "number-badge",
    title: "NumberBadge",
    description: {
      en: "A self-anchoring count badge for avatars and icons with 99+ overflow.",
      ko: "아바타·아이콘 위에 얹히는 카운트 뱃지로 99+ 오버플로를 지원합니다.",
    },
  },
] as const
