import { css } from '@emotion/react'

export const dayViewStyles = css`
  /* 전체 컨테이너 높이 및 스크롤 제거 */
  .rbc-time-view {
    border: none !important;
    overflow: visible !important;
    height: auto !important;
    flex: none !important;
  }

  /* 헤더(요일/숫자) 영역 - 종강, 할머니댁 같은 All-day 이벤트 배치 */
  .rbc-time-header {
    margin-right: 0 !important;
    .rbc-time-header-content {
      border-left: none !important;
    }
  }

  /* 핵심: 시간 영역을 Grid로 2단 분할 */
  .rbc-time-content {
    display: grid !important;
    grid-template-columns: 1fr 1fr; /* 좌우 50%씩 */
    border-top: none !important;
    overflow: visible !important;
    height: auto !important;
    gap: 0 40px; /* 좌우 컬럼 사이 간격 */
    padding: 0 20px;
  }

  /* 시간 라벨과 그리드를 감싸는 기본 컬럼 설정 해제 */
  .rbc-time-gutter,
  .rbc-day-slot {
    flex: none !important;
    width: 100% !important;
  }

  /* 시간 숫자(00:00) 스타일 */
  .rbc-label {
    padding: 0 10px !important;
    font-size: 13px;
    color: #70757a;
  }

  /* 각 시간 칸의 높이 조절 */
  .rbc-timeslot-group {
    min-height: 45px !important;
    border-bottom: 1px solid #f1f1f1 !important;
  }

  /* 00-11시와 12-23시를 구분하는 로직은 JS에서 처리하는 것이 베스트이나, 
     CSS만으로 구현할 경우 다음과 같이 처리합니다. */

  /* 좌측 컬럼 (0시~12시만 표시) */
  .rbc-time-content > .rbc-time-gutter {
    grid-column: 1;
    display: flex;
    flex-direction: column;
  }

  /* 우측 컬럼 (12시~24시 표시용 가상 요소처럼 작동하게 구성) */
  .rbc-day-slot {
    grid-column: 2;
    border-left: 1px solid #f1f1f1 !important;
  }

  /* 이벤트 스타일 */
  .rbc-event {
    border: none !important;
    border-radius: 4px !important;
    padding: 10px !important;
    width: 95% !important;
    left: 2.5% !important;
  }
`
