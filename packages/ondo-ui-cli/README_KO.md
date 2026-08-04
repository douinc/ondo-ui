# Ondo UI

[English](README.md)

Ondo UI는 따뜻하고 신뢰감 있는 무드를 지향하는 오픈소스 디자인 시스템입니다. 어린 사용자부터 나이 든 사용자까지 모든 세대가 낯설거나 부담스럽지 않게, 안심하고 쓸 수 있도록 데스크탑과 모바일 모두를 기준으로 설계했습니다. 컴포넌트·토큰·테마를 shadcn registry로 배포해, 디자인과 코드가 늘 같은 소스를 공유합니다.

## 누가 쓰나요

디자인팀은 Ondo UI의 컴포넌트와 토큰 위에서 화면을 설계하고, 개발팀은 같은 registry 컴포넌트를 shadcn MCP로 설치해 그 디자인을 그대로 구현합니다. 둘이 따로 만들지 않고, 하나의 소스로 맞춰 갑니다.

## 어디에 어울리나요

특정 분야에 매이지 않습니다. 넓은 연령대가 쓰거나, 편안함과 신뢰가 중요한 제품이라면 어디든 잘 맞습니다. 화려함보다 명료함, 복잡함보다 편안함이 필요한 곳이라면 — 웹이든 앱이든 하나의 일관된 무드로 이어 줍니다.

## 왜 Ondo인가요

"온도(Ondo)"는 모든 제품의 무드를 일정한 온도로 맞추는 일을 뜻합니다. 토큰은 °C, 라이트/다크는 Warm/Cool처럼 — 브랜드가 하나의 감각으로 이어집니다.

## 작업 흐름

Ondo UI는 디자인–개발 순환의 중심에 있습니다. 디자인팀과 개발팀 모두 **shadcn MCP**를 통해 같은 registry에 접근합니다. 디자인팀은 Ondo UI의 컴포넌트와 토큰을 기반으로 제품 화면을 디자인하고, 개발팀은 그 디자인을 동일한 registry 컴포넌트로 구현합니다. 디자인과 코드가 항상 하나의 소스를 공유합니다.

```mermaid
flowchart TD
    classDef default fill:#4a90d9,stroke:#6ab0ff,color:#fff

    subgraph ondo["🌡️ Ondo UI"]
        registry["컴포넌트 & 테마 Registry<br/>registry.json"]
    end

    mcp["🔌 shadcn MCP"]

    subgraph design["🎨 디자인팀"]
        mockup["제품 화면 디자인"]
    end

    subgraph dev["🛠️ 개발팀"]
        add["컴포넌트 탐색·설치<br/>(ondo-ui add)"] --> product["제품 구현"]
    end

    registry -->|"컴포넌트 & 토큰"| mcp
    mcp --> mockup
    mcp --> add
    mockup -->|"디자인 핸드오프"| add
    design -.->|"신규 컴포넌트 & 개선 제안"| ondo
```

1. **Ondo UI**가 컴포넌트·테마·토큰을 shadcn registry로 배포합니다.
2. **디자인팀**과 **개발팀** 모두 shadcn MCP를 통해 동일한 registry에 접근합니다.
3. 디자인팀이 Ondo UI 컴포넌트를 기반으로 제품 화면을 디자인해 개발팀에 전달합니다.
4. 개발팀이 MCP나 `ondo-ui add`로 컴포넌트를 탐색하고 설치해 디자인을 구현합니다.
5. 디자인 과정에서 나온 신규 컴포넌트와 개선 제안은 다시 Ondo UI에 반영되고, 순환이 반복됩니다.

## shadcn MCP 설정

두 단계면 AI 도구(Claude Code, Cursor 등)에서 Ondo UI registry를 사용할 수 있습니다.

**1. 레지스트리 등록** — 프로젝트의 `components.json`에 `@ondo-ui` 네임스페이스를 추가합니다:

```json
{
  "registries": {
    "@ondo-ui": "https://ui.ondo.dou.so/r/{name}.json"
  }
}
```

**2. MCP 서버 등록** — 사용하는 클라이언트에 맞춰 실행합니다:

```bash
npx shadcn@latest mcp init --client claude   # Claude Code
npx shadcn@latest mcp init --client cursor   # Cursor
npx shadcn@latest mcp init --client vscode   # VS Code
```

설정 후에는 AI에게 자연어로 요청하면 됩니다:

- "@ondo-ui 레지스트리에 있는 컴포넌트를 보여줘"
- "@ondo-ui의 button과 card를 이 페이지에 추가해줘"

자세한 내용은 [설치 문서](https://ui.ondo.dou.so/ko/docs/installation)를 참고하세요.

## Ondo CLI

지원되는 framework를 초기화하고 Ondo 테마를 설치합니다:

```bash
bunx --bun @dou.so/ondo-ui init -t astro
```

Components와 Compositions를 그룹별로 선택하려면 다음 명령어를 실행합니다:

```bash
bunx --bun @dou.so/ondo-ui add
```

이름을 직접 지정하거나 설치 결과를 미리 볼 수도 있습니다:

```bash
bunx --bun @dou.so/ondo-ui add button empty-view
bunx --bun @dou.so/ondo-ui add button --dry-run
bunx --bun @dou.so/ondo-ui add --all
```

메뉴에서는 일반 registry UI 컴포넌트와 `empty-view`, `number-badge` 같은
조합 컴포넌트를 분리해 보여줍니다. `theme-provider` 같은 시스템 항목은
이름을 직접 지정할 때만 설치됩니다.

shadcn의 프로젝트·registry 명령도 그대로 사용할 수 있습니다:

```bash
bunx --bun @dou.so/ondo-ui search --query button
bunx --bun @dou.so/ondo-ui view @ondo-ui/button
bunx --bun @dou.so/ondo-ui info
bunx --bun @dou.so/ondo-ui mcp init --client claude
```

다른 프로젝트에서 실행하려면 `--cwd <path>`를 사용하세요. `build`와
`registry` 같은 registry 제작 명령도 maintainer를 위해 전달됩니다.

## 컴포넌트 추가하기

앱에 컴포넌트를 추가하려면 다음 명령어를 실행하세요:

```bash
bunx --bun @dou.so/ondo-ui add button
```

이 명령어는 UI 컴포넌트를 `components` 디렉토리에 배치합니다. 공식
shadcn 명령어를 직접 사용하려면 Ondo namespace를 지정하세요:

```bash
bunx --bun shadcn@latest add @ondo-ui/button
```

## 컴포넌트 사용하기

앱에서 컴포넌트를 사용하려면 다음과 같이 import 하세요:

```tsx
import { Button } from "@/components/ui/button";
```

## 기여자

<a href="https://github.com/douinc/ondo-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=douinc/ondo-ui" alt="기여자" />
</a>
