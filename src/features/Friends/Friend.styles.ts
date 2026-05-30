import styled from '@emotion/styled'

export const PageLayout = styled.div`
  display: flex;
  gap: 24px;
  margin: 0 auto;
  min-height: 100vh;

  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
`

export const Column = styled.div<{ width: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: ${(props) => props.width};

  @media (max-width: 768px) {
    width: 100% !important;
    gap: 16px;
  }
`

export const SharedHeader = styled.div<{ bgColor?: string }>`
  background: ${(props) => props.bgColor || '#EBEAF8'};
  margin: -24px -24px 0 -24px;
  padding: 18px 24px;
  border-radius: 30px 30px 0 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    width: 100% !important;
    margin: -16px -16px 0 -16px;
    padding: 16px;
  }
`

export const HeaderTitle = styled.h2<{ color?: string }>`
  font-size: 18px;
  font-weight: 800;
  color: ${(props) => props.color || '#594fca'};
  margin: 0;
  padding: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
`

export const HeaderBadge = styled.div`
  background: border-radius: 30px;
  background: #594FCA;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  min-width: 26px;
  height: 26px;
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 18px;
  box-shadow: 0 2px 4px rgba(92, 106, 196, 0.2);
`

export const SharedContent = styled.div<{ bgColor?: string; maxHeight?: string }>`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.bgColor || '#f8f9fa'};

  margin: 0 -24px -24px -24px;
  padding: 24px;

  border-radius: 0 0 30px 30px;

  max-height: ${(props) => props.maxHeight || '600px'};
  overflow-y: auto;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: #dee2e6;
  }

  @media (max-width: 768px) {
    width: 100% !important;
    margin: 0;
  }
`
export const SectionContainer = styled.div<{ bgColor?: string; maxHeight?: string }>`
  background: ${(props) => props.bgColor || '#ffffff'};
  border: 1px solid #eeeeee;
  border-radius: 30px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

  max-height: ${(props) => props.maxHeight || 'none'};
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #dee2e6;
    }
  }

  @media (max-width: 800px) {
    padding: 16px;
  }
`

export const SectionTitle = styled.h2<{ color?: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.color || '#1a7c91'};
  margin: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ScrollArea = styled.div<{ maxHeight: string }>`
  max-height: ${(props) => props.maxHeight};
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px; /* 스크롤바가 콘텐츠를 가리지 않도록 여백 */

  /* 기본 상태: 스크롤바 투명하게 설정 */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #dee2e6;
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const CommonButton = styled.button<{ bgColor: string; textColor: string }>`
  border: none;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  padding: 14px 22px 13px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`
