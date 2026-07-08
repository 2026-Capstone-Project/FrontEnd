import styled from '@emotion/styled'

export const AddButton = styled.button`
  width: 54px;
  height: 35px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 17px 40px 16px 20px;
  border-radius: 20px;
  border: 1px solid #eeeeee;
  outline: none;
  box-sizing: border-box;
`

export const SearchIconWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`

export const EmptyRequest = styled.div`
  padding: 16px 0;
  color: #999999;
  font-size: 14px;
  text-align: center;
`

export const RequestItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
`

export const RequestAvatar = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #666666;
  flex-shrink: 0;
`

export const RequestInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const RequestNameLine = styled.div`
  font-size: 15px;
`

export const RequestName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  letter-spacing: -0.3px;
`

export const RequestEmail = styled.div`
  font-size: 14px;
  color: #999999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RequestActions = styled.div`
  display: flex;
  gap: 8px;
`

export const EmptyInvitation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`

export const EmptyInvitationTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
`

export const EmptyInvitationText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #868e96;
  line-height: 1.5;
  letter-spacing: -0.2px;
  word-break: keep-all;
`

export const EmptyShared = styled.div`
  padding: 30px 20px;
  text-align: center;
  color: #adb5bd;
  background: #ffffff;
  border-radius: 20px;
  font-size: 14px;
`
