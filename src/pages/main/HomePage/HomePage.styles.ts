import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  width: 100%;
  gap: 20px;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    padding: 40px;
    gap: 40px;
  }
`

export const Left = styled.div`
  width: 540px;
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
  color: ${theme.colors.gray.point};
`
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
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
  display: block;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  padding: 4px 8px;
  border-radius: 12px;

  ${(props) =>
    props.type === 'remind'
      ? `
        color: #f59e0b;
      `
      : `
        position: relative;
        color: #4684C1; 
        

        background: linear-gradient(90deg, #4684C1 0%, #00DCCC 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 12px; 
          padding: 1px; 
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
  display: absolute;
  width: 56px;
  height: 56px;

  top: 16px;
  right: 16px;
`
