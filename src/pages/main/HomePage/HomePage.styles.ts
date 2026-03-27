import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 20px;
  position: relative;
  ${media.up(theme.breakPoints.desktop)} {
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
  }
`

export const Left = styled.div`
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`
export const DateTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.black};
`

export const SubTitle = styled.p`
  font-size: 20px;
  margin-top: 4px;
  color: ${theme.colors.GRAY.point};
`
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

export const Card = styled.div`
  background: #ffffff;
  border-radius: 30px;
  padding: 25px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  position: relative;
`

export const BriefingCard = styled(Card)`
  padding: 0;
  border-radius: 30px;
`

export const BriefingHeader = styled.div`
  background: #f0f7f9;
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6f1f5;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`

export const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #025a74;
  margin: 0;
`

export const BriefingContent = styled.div`
  padding: 30px;
  background: #ffffff;
`

export const RedDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #e94b43;
  border-radius: 50%;
`

export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
  border-left: 4.5px solid #4490b4; // 이미지처럼 굵은 세로 바
  margin: 10px 0;
`

export const ScheduleItem = styled.div`
  display: flex;
  gap: 25px;
  align-items: center;

  .time {
    font-size: 19px;
    font-weight: 600;
    color: #4490b4;
    width: 55px;
  }
  .content {
    font-size: 19px;
    font-weight: 500;
    color: #1a1a1a;
    text-decoration: ${(props: { isDeadline?: boolean }) =>
      props.isDeadline ? 'underline' : 'none'};
    text-underline-offset: 5px;
  }
`

export const BadgeRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 30px 30px 0;
  margin-top: -10px; // 내용물과 간격 조절
`

export const Badge = styled.div`
  padding: 17px 29px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #ebefef;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: ${theme.colors.primary2};
    font-size: 19px;
    margin-right: 6px;
  }
`
export const TodoText = styled.p`
  margin: 0;
  font-size: 16px;
  color: #333;
  text-underline-offset: 4px;
  text-decoration: underline;
`

export const Tag = styled.span<{ type?: 'remind' | 'ai' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 14px;
  margin-bottom: 20px;
  width: fit-content;
  line-height: 1;

  ${(props) =>
    props.type === 'remind'
      ? `
        color: #f59e0b;
      `
      : `
        position: relative;
        background: linear-gradient(90deg, #4684C1 0%, #00DCCC 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px; 
          padding: 2px; 
          background: linear-gradient(90deg, #4684C1 0%, #00DCCC 100%);
          -webkit-mask: 
             linear-gradient(#fff 0 0) content-box, 
             linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}
`
export const CardText = styled.p`
  font-size: 17px;
  font-weight: 600;
  line-height: 1.6;
  color: #1e293b;
  margin: 0;

  b {
    font-weight: 800;
  }
`

export const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 25px;
`

export const GhostButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  background: #fafafa;
  color: #3da4b2;
  font-weight: 700;
  border: none;
  cursor: pointer;
`

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  background: #4490b4;
  color: #ffffff;
  font-weight: 700;
  border: none;
  cursor: pointer;
`

export const IconWrapper = styled.div`
  position: absolute;
  width: 56px;
  height: 56px;

  top: 16px;
  right: 16px;
`
// --- 개발용 임시 버튼 스타일 --- 끝나면 지울 예정 ---
export const DevButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  border: 1px dashed #ced4da;
  border-radius: 12px;
  background-color: #f8f9fa;

  button {
    flex: 1;
    padding: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #495057;
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #e9ecef;
      border-color: #adb5bd;
    }

    &:active {
      background-color: #dee2e6;
    }
  }
`
