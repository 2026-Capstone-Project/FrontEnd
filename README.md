# Calio - 2026 Capstone Frontend

Vite + React 기반의 프론트엔드 프로젝트로, 캘린더와 투두 등 사용자 인터랙션이 많은 화면을 중심으로 빠른 데이터 패칭, 상태/폼 관리, 테스트 환경을 함께 구성하고 있습니다.

## Contributors

|                                             **김연진(코튼)**                                              |                                            **지유진 (제이)**                                             |
| :-------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
| <img width="150" height="150" alt="김연진" src="https://avatars.githubusercontent.com/u/111187984?v=4" /> | <img width="150" height="150" alt="지유진" src="https://avatars.githubusercontent.com/u/69490799?v=4" /> |
|                               [@yeonjin719](https://github.com/yeonjin719)                                |                                [@yujin5959](https://github.com/yujin5959)                                |

### 커밋/PR/브랜치 규칙

- 커밋 메시지는 의미 있는 영어/한글로 상태와 변경을 담되 `gitmoji`식 장식은 생략하고 `feat:`/`fix:`/`chore:` 등 일반 접두사 활용을 권장합니다.
- PR 제목은 `[Feature/#1] 작업내용`처럼 `[...]` 안에 이슈/기능 번호를 넣고 이후 작업을 간단히 설명합니다.
- 브랜치 이름은 `feature/#1-작업내용` 형태로, 기능 번호와 핵심 설명을 `#`으로 연결해 생성합니다.

## 협업 컨벤션

- ESLint는 `.vscode/settings.json`에서 `source.fixAll.eslint`와 `source.organizeImports`를 설정해 저장 시 자동 정렬합니다.
- `simple-import-sort`의 `imports/exports` 룰과 `react/self-closing-comp`가 적용되어 있으므로 이를 위반하면 lint 오류가 납니다.
- GitHub Copilot 리뷰 가이드(`.github/COPILOT_REVIEW.md`)에 아키텍처/구조/성능/접근성 기준이 정리되어 있으니 리뷰 시 참고합니다.
- 새로운 기능을 도입할 때는 `src/features`와 `src/shared` 사이의 책임을 명확히 하고, alias(`@/...`)를 유지하세요.
- 이슈가 필요하면 GitHub 프로젝트(프로젝트 탭 또는 지정된 도구)에서 먼저 등록한 뒤 이슈 번호/링크를 커밋/PR에 포함합니다.

## 주요 구조

- `src/app`: 엔트리/전역 설정(`main.tsx`, `App.tsx`)과 shared 레이아웃(`shared/layout`)을 정의합니다.
- `src/pages`: 라우트 타겟 페이지(`CalendarPage`)를 담고, 각 페이지는 기능 단위(`features`)를 조합하여 구성합니다.
- `src/features`: 캘린더 기능을 기준으로 `components`, `hooks`, `utils`, `mocks`, `domain` 등 도메인 단위 모듈이 모여 있습니다.
- `src/shared`: 여러 페이지에서 재사용되는 UI, 훅, 스타일, 레이아웃, 테마, 타입을 담습니다. 예: `shared/layout`, `shared/styles`, `shared/constants`.
- `src/assets`: 그림/아이콘 등 정적 자산. `vite-plugin-svgr`을 통해 SVG를 React 컴포넌트로 import합니다.
- `src/types`: 공통 타입 정의(예: `EventColorType`).
- `src/routes`: TanStack Router 기반(예정) 라우팅 트리를 위치시킬 폴더입니다.
- Alias: `tsconfig.app.json`과 `vite-tsconfig-paths`를 통해 `@/` 접두사가 `src/`를 가리키므로 `@/features/...`처럼 통일된 방식으로 import하세요.

## Tech Stack

- Core: React, TypeScript, Vite
- Routing: `react-router-dom`
- State Management: `zustand`(UI 상태) + `@tanstack/react-query`(서버 상태)
- HTTP: `axios` (인터셉터 포함)
- Styling: `@emotion/react`, `@emotion/styled`, 테마/컬러 팔레트 기반 스타일
- Form/Validation: `react-hook-form`, `yup`, `@hookform/resolvers`
- SVG: `vite-plugin-svgr`으로 SVG를 React 컴포넌트화
- Testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- Lint/Format: `eslint`(custom config + `simple-import-sort`, `react/self-closing-comp`), `prettier`

## 주요 스크립트

| 스크립트          | 설명                                      |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Vite 개발 서버                            |
| `npm run build`   | TypeScript 빌드(`tsc -b`) 및 Vite 빌드    |
| `npm run lint`    | ESLint 검증(간편히 `eslint --fix`도 가능) |
| `npm run preview` | 빌드 결과 미리보기                        |
| `npm run prepare` | Husky 훅 설치                             |

## 환경 변수

- `.env`(개인 설정)와 `.env.example`(팀 공유 템플릿)을 루트에 위치시킵니다.
- 현재 프로젝트에서 읽는 키:
  - `VITE_DEV_MODE`: React Query DevTools를 로컬에서만 표시하려면 `true`, 배포 시 `false`.
  - `VITE_SERVER_URL`: 서버 URL
- `.env.example`을 복사하여 `.env`로 만들고 팀 기준대로 값을 수정하세요.

## Node Version

Node.js 20 LTS를 기준으로 개발합니다.

```bash
node -v
# v20.x.x
```
