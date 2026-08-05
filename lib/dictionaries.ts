import { resolveLocale, type Locale } from "@/lib/i18n"

const en = {
  nav: {
    home: "Home",
    docs: "Docs",
    components: "Components",
    compositions: "Compositions",
    blocks: "Blocks",
    colors: "Colors",
  },
  home: {
    title: "Warm, trustworthy UI for every generation",
    description:
      "An open-source design system built to feel warm and trustworthy\n— for every generation, on desktop and mobile.",
    getStarted: "Get Started",
    viewComponents: "View Components",
    cards: {
      whoTitle: "Who uses it",
      whoDescription:
        "Designers build on Ondo UI's components and tokens; developers install the same registry through the shadcn MCP. One source, no drift.",
      whereTitle: "Where it fits",
      whereDescription:
        "Any product used across a wide range of ages, or wherever comfort and trust matter — web or app, one consistent mood.",
      whyTitle: "Why Ondo",
      whyDescription:
        "Ondo means temperature. Tokens as °C, light and dark as Warm and Cool — one brand, felt as a single temperature.",
    },
  },
  components: {
    title: "Components",
    description: "Copy-and-paste components built on Base UI and Tailwind CSS.",
  },
  compositions: {
    title: "Compositions",
    description:
      "The layer between components and blocks — reusable UI patterns assembled from ondo-ui primitives and exposed as a single component with a focused props API.",
  },
  blocks: {
    title: "Blocks",
    description: "Ready-made sections built from ondo-ui components.",
    comingSoon: "Coming soon",
    comingSoonDescription:
      "Blocks are under construction. Check back after more components land in the registry.",
    viewer: {
      preview: "Preview",
      code: "Code",
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
      openNewTab: "Open in new tab",
      refresh: "Refresh preview",
      files: "Files",
      copyInstall: "Copy install command",
    },
  },
  changelog: {
    title: "Changelog",
    description: "New features, improvements, and fixes.",
  },
  colors: {
    title: "Colors",
    description: "The ondo-ui theme tokens. Click any value to copy it.",
    copied: "Copied!",
    custom: "Custom",
    fields: "Fields",
  },
  search: {
    placeholder: "Search documentation...",
    placeholderShort: "Search...",
    title: "Search documentation",
    description: "Search for a page or component",
    noResults: "No results found.",
    searching: "Searching...",
    resultsHeading: "Search Results",
    pagesHeading: "Pages",
    colorsHeading: "Colors",
    themeHeading: "Theme",
    toggleDarkMode: "Toggle dark mode",
    goToPage: "Go to Page",
    copyValue: "Copy Value",
    copyCommand: "Copy Command",
  },
  docs: {
    copyPage: "Copy Page",
    viewMarkdown: "View as Markdown",
    onThisPage: "On This Page",
    previous: "Previous",
    next: "Next",
    ctaTitle: "ondo/ui on GitHub",
    ctaDescription: "Browse the source, open issues, and star the project.",
    ctaButton: "Star on GitHub",
  },
  header: {
    menu: "Menu",
    toggleMenu: "Toggle Menu",
    toggleTheme: "Toggle theme",
    changeLanguage: "Change language",
  },
  footer: {
    p1: "Built by ",
    dou: "dou",
    p2: ". The source code is available on ",
    gh: "GitHub",
    p3: ".",
  },
}

const ko: typeof en = {
  nav: {
    home: "홈",
    docs: "문서",
    components: "컴포넌트",
    compositions: "조합 컴포넌트",
    blocks: "블록",
    colors: "색상",
  },
  home: {
    title: "모든 세대를 위한 따뜻한 UI",
    description:
      "따뜻하고 신뢰감 있는 오픈소스 디자인 시스템\n— 모든 세대를 위해, 데스크탑과 모바일 모두에서.",
    getStarted: "시작하기",
    viewComponents: "컴포넌트 보기",
    cards: {
      whoTitle: "누가 쓰나요",
      whoDescription:
        "디자인팀은 Ondo UI의 컴포넌트와 토큰 위에서 설계하고, 개발팀은 같은 registry를 shadcn MCP로 설치합니다. 하나의 소스, 어긋남 없이.",
      whereTitle: "어디에 어울리나요",
      whereDescription:
        "넓은 연령대가 쓰거나, 편안함과 신뢰가 중요한 제품이라면 어디든 — 웹이든 앱이든 하나의 무드로.",
      whyTitle: "왜 Ondo인가요",
      whyDescription:
        "온도(Ondo)는 무드를 일정하게 맞추는 일. 토큰은 °C, 라이트/다크는 Warm/Cool — 브랜드가 하나의 감각으로.",
    },
  },
  components: {
    title: "컴포넌트",
    description: "Base UI와 Tailwind CSS로 만든 복사-붙여넣기 컴포넌트입니다.",
  },
  compositions: {
    title: "조합 컴포넌트",
    description:
      "컴포넌트와 블록 사이의 계층입니다. 자주 반복되는 UI 패턴을 ondo-ui 프리미티브로 조합해, 집중된 props API를 가진 하나의 컴포넌트로 제공합니다.",
  },
  blocks: {
    title: "블록",
    description: "ondo-ui 컴포넌트로 조합한 바로 쓸 수 있는 섹션입니다.",
    comingSoon: "준비 중",
    comingSoonDescription:
      "블록은 준비 중입니다. 레지스트리에 컴포넌트가 더 추가되면 만나보실 수 있어요.",
    viewer: {
      preview: "미리 보기",
      code: "코드",
      desktop: "데스크톱",
      tablet: "태블릿",
      mobile: "모바일",
      openNewTab: "새 탭에서 열기",
      refresh: "미리 보기 새로고침",
      files: "파일",
      copyInstall: "설치 명령 복사",
    },
  },
  changelog: {
    title: "변경 내역",
    description: "새로운 기능, 개선 사항, 수정 내역.",
  },
  colors: {
    title: "색상",
    description: "ondo-ui 테마 토큰입니다. 원하는 값을 클릭하면 복사됩니다.",
    copied: "복사됨!",
    custom: "커스텀",
    fields: "필드",
  },
  search: {
    placeholder: "문서 검색...",
    placeholderShort: "검색...",
    title: "문서 검색",
    description: "페이지나 컴포넌트를 검색하세요",
    noResults: "검색 결과가 없습니다.",
    searching: "검색 중...",
    resultsHeading: "검색 결과",
    pagesHeading: "페이지",
    colorsHeading: "색상",
    themeHeading: "테마",
    toggleDarkMode: "다크 모드 전환",
    goToPage: "페이지로 이동",
    copyValue: "값 복사",
    copyCommand: "명령어 복사",
  },
  docs: {
    copyPage: "페이지 복사",
    viewMarkdown: "마크다운으로 보기",
    onThisPage: "이 페이지에서",
    previous: "이전",
    next: "다음",
    ctaTitle: "GitHub의 ondo/ui",
    ctaDescription: "소스 코드를 살펴보고, 이슈를 남기고, 스타를 눌러주세요.",
    ctaButton: "GitHub에서 스타",
  },
  header: {
    menu: "메뉴",
    toggleMenu: "메뉴 열기/닫기",
    toggleTheme: "테마 전환",
    changeLanguage: "언어 변경",
  },
  footer: {
    p1: "",
    dou: "dou",
    p2: "에서 만들었습니다. 소스 코드는 ",
    gh: "GitHub",
    p3: "에 공개되어 있습니다.",
  },
}

export type Dictionary = typeof en

const dictionaries: Record<Locale, Dictionary> = { en, ko }

export function getDictionary(lang: string): Dictionary {
  return dictionaries[resolveLocale(lang)]
}
