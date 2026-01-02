# 2026 Capstone Frontend

Vite + React 기반의 프론트엔드 프로젝트입니다.  
사용자 인터랙션이 많은 서비스 특성에 맞춰 상태 관리, 데이터 패칭, 폼 검증, 테스트 환경을 함께 구성했습니다.

---

## Tech Stack

### Core

- React
- TypeScript
- Vite

### Routing

- react-router-dom

### State Management

- zustand  
  전역 UI 상태 및 클라이언트 상태 관리

### Server State / Data Fetching

- @tanstack/react-query  
  서버 상태 관리, 캐싱, 비동기 요청 처리

### HTTP Client

- axios  
  API 요청 공통화 및 인터셉터 관리

### Styling

- @emotion/react
- @emotion/styled  
  CSS-in-JS 기반 스타일링 및 테마 확장

### Form & Validation

- react-hook-form  
  폼 상태 관리
- yup  
  입력값 검증 스키마
- @hookform/resolvers  
  react-hook-form과 yup 연동

### Testing

- vitest  
  Vite 기반 테스트 러너
- @testing-library/react  
  React 컴포넌트 테스트
- @testing-library/jest-dom  
  DOM matcher 확장
- @testing-library/user-event  
  사용자 이벤트 시뮬레이션

### SVG Handling

- vite-plugin-svgr  
  SVG를 React 컴포넌트로 사용하기 위한 플러그인

---

## Node Version

본 프로젝트는 **Node.js 20 LTS** 환경을 기준으로 개발되었습니다.

```bash
node -v
# v20.x.x
```
