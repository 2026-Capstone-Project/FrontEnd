# 아키텍처·구조 중심 Copilot 리뷰 안내

이 문서는 GitHub Copilot이 이 저장소에서 리뷰어 역할을 맡을 때 참고할 지침을 한국어로 정리한 것입니다. 단순 구현보다 아키텍처, 구조, 폴더 관습, 일관성을 우선 점검하세요.

## 1. 언어와 톤

- 모든 코멘트는 **한국어**로 작성합니다.
- 개발자의 관점에서 간결하지만 충분한 맥락을 제공하고, 질문보다 위반 사항을 먼저 지적합니다.

## 2. 역할 우선순위

1. 폴더/파일 위치가 기존 패턴과 일치하는지 확인합니다 (`src/pages`는 페이지, `src/features`는 기능별 모듈).
2. 컴포넌트가 단일 책임(SRP)을 지키는지 봅니다. 컨테이너/프레젠테이션이 섞였으면 구조적 분리를 권장하세요.
3. import 방향을 확인하여 `shared`→`feature` 역방향이 생기지 않도록 하고, `@/` alias(`tsconfig.app.json` + `vite-tsconfig-paths`)를 지켜야 합니다.
4. 명명 규칙: 컴포넌트/폴더는 PascalCase, 훅/유틸은 camelCase(경로 케이스도 주변 관습을 따릅니다).
5. 배럴(`index.ts`)은 기존 영역의 스타일을 따르고, 새로 도입할 때는 같은 폴더에 배럴 규칙이 있는지 먼저 확인합니다.
6. 테스트/스토리는 대상 컴포넌트/훅과 동일 폴더에 두고 `MyComponent.test.tsx`나 `MyComponent.stories.tsx`처럼 일관된 네이밍을 유지합니다.

## 3. 현재 프로젝트 구조 참고

- `src/app`: 엔트리/전역 설정 (`main.tsx`, `App.tsx`).
- `src/pages`: 페이지 단위 UI. 스타일/훅/서브컴포넌트도 페이지 하위에 둡니다.
- `src/features`: 기능별 모듈(ex. `Calendar/components`, `Calendar/mocks`). domain/components/styles/hooks/mocks 등 내부 구조를 자유롭게 구성하되 feature boundary를 넘기지 않습니다.
- `src/shared`: 공용 UI, 훅, 스타일, 타입, 스키마.
- `src/assets`: 전역 자산.
- `src/pages/Calendar`에서 feature로 분리한 컴포넌트는 `src/features/Calendar`로 유지해야 하고, 새 구조도 이 흐름을 이어 받아야 합니다.

## 4. 의존성 / import 규칙

- `shared`는 `features`, `routes`, `app`을 import하지 않습니다.
- `features`는 `shared`를 import할 수 있고, `routes`는 `features`, `shared`, `app`만 조합합니다.
- `@/` alias는 `tsconfig.app.json`(`baseUrl` + `paths`)과 `vite-tsconfig-paths`에 따라 `src/*`로 매핑되었으니 새 경로를 도입할 때 반드시 점검하세요.
- ESLint는 `eslint-plugin-simple-import-sort`(`eslint.config.js`)으로 import 순서를 강제합니다. 위반 시 `simple-import-sort/imports` 룰을 기준으로 지적하세요.
- `.vscode/settings.json`은 `source.fixAll.eslint`와 `source.organizeImports`를 켜두어 저장 시 자동 정렬이 작동하므로, 리뷰에 이 설정이 반영되어야 합니다.

## 5. 배럴/폴더 규칙

- 기존 배럴 사용 예: `shared/ui/common/*/index.ts`, `features/*/domain/index.ts`.
- 새로운 배럴을 만들기 전 동일 영역의 관습을 확인하고, 같은 방식으로 추가하세요.

## 6. 테스트/스토리 위치와 네이밍

- 테스트/스토리 파일은 해당 컴포넌트나 훅과 같은 폴더에 둡니다.
- 이름은 `MyComponent.test.tsx`/`MyComponent.stories.tsx`처럼 컴포넌트 이름을 포함합니다.
- 테스트/스토리가 없는 영역이라도 추가할 때 위 패턴을 따르도록 안내하세요.

## 7. 리뷰 출력 형식 (반드시 준수)

1. **한 줄 요약** – 핵심 위반이나 관찰 사항을 짧게 정리합니다.
2. **발견된 위반 항목** – 경로와 함께 위반 내용을 나열합니다.
3. **추천 구조** – 트리 형태(간단한 폴더/파일 구조)로 개선 방향을 제시합니다.
4. **최소 리팩토링 단계** – 1~5 단계로 실제 진행 순서를 제안합니다.
5. **(선택)** 패치 스타일 코드 제안 – 필요하면 코드 스니펫을 첨부합니다.

이 지침은 GitHub Copilot이 리뷰나 코멘트를 생성할 때 우선 참고하기 위한 목적입니다. 아키텍처/구조 위주로 관찰한 후 필요한 개선을 단계적으로 제안해 주세요.

## 8. 성능 점검 가이드

- 캘린더처럼 이벤트/데이터가 많은 화면에서는 `React.memo`, `useMemo`, `useCallback` 등으로 렌더를 줄이고 있는지 확인하고 memoization 적용을 권장합니다.
- 반복 렌더링 리스트에서 virtualization 없이 구현되어 있다면 스크롤/첫 렌더 성능을 지적하고, `react-window`/`react-virtual` 등의 뷰포트 최적화를 소개합니다.
- `useEffect`/`useLayoutEffect` dependency array에 누락이나 과한 의존성이 있으면 불필요한 재요청/렌더링이 생기므로 경고하고 정확한 dependencies를 명시하도록 합니다.
- 스타일 객체나 함수를 렌더마다 새로 만들면 렌더 부담이 커지므로 컴포넌트 외부로 옮기거나 `useMemo`/`useCallback`으로 감싸도록 제안합니다。

## 9. 시맨틱/접근성 점검 가이드

- 주요 인터랙션 요소(버튼, 네비게이션, 폼)는 시맨틱 HTML 태그(`<button>`, `<nav>`, `<section>` 등)를 사용하는지 확인하고, `div`/`span`만 사용할 경우 적절한 태그로 바꾸는 것을 권장합니다.
- `aria-label`, `aria-labelledby`, `aria-describedby` 등을 붙여 화면 리더가 의미를 파악할 수 있는지 점검하고, 시각적으로 텍스트가 없는 경우에도 설명을 명시하라고 코멘트합니다.
- 상태 변화(로딩, 에러, 선택/활성)에 대해서 `aria-live`, `role`, `aria-pressed` 같은 속성이 적절히 부여됐는지 검토합니다.
- 컬러 대비, 키보드 접근성(tab order, focus-visible)도 챙기고, 커스텀 버튼 등에 `tabIndex`/`aria` 속성이 빠졌다면 보완을 안내합니다。
