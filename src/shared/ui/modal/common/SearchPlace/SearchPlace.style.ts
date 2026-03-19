import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  color: ${theme.colors.textColor3};
`

export const InputForm = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const SearchInput = styled.input`
  width: 100%;
  border-radius: 12px;
  padding: 12px 84px 12px 14px;
  border: 1px solid #acacac;
  background-color: ${theme.colors.white};
  color: ${theme.colors.textColor2};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #9a9a9a;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary2};
    box-shadow: 0 0 0 4px rgba(19, 138, 172, 0.08);
  }
`

export const InputActions = styled.div`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
`

const InputActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${theme.colors.primary2};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    background-color: ${theme.colors.primary2};
    color: ${theme.colors.white};
  }
`

export const ConfirmButton = styled(InputActionButton)<{ $isActive?: boolean }>`
  color: ${({ $isActive }) => ($isActive ? theme.colors.white : theme.colors.textPrimary)};
  background-color: ${({ $isActive }) => ($isActive ? theme.colors.primary2 : theme.colors.sub)};
  &:not(:disabled):hover {
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
  }
`

export const SearchButton = styled(InputActionButton)``

export const SearchPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 188px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(19, 138, 172, 0.12);
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const PanelTitle = styled.h4`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
`

export const PanelCaption = styled.span`
  color: ${theme.colors.textColor3};
  font-size: 11px;
`

export const PanelBody = styled.div`
  min-height: 0;
  flex: 1;
`

export const PanelScroll = styled.div`
  height: 148px;
  overflow-y: auto;
`

export const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SearchList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ResultButton = styled.button<{ $isActive: boolean; $compact?: boolean }>`
  width: 100%;
  border: 1px solid
    ${({ $isActive }) => ($isActive ? theme.colors.primary2 : 'rgba(19, 138, 172, 0.14)')};
  background: ${({ $isActive }) => ($isActive ? theme.colors.sub : theme.colors.white)};
  border-radius: ${({ $compact }) => ($compact ? '12px' : '14px')};
  padding: ${({ $compact }) => ($compact ? '10px 12px' : '12px 14px')};
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(17, 24, 39, 0.06);
  }
`

export const PlaceName = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
`

export const PlaceMeta = styled.span`
  color: ${theme.colors.primary2};
  font-size: 12px;
`

export const PlaceAddress = styled.span`
  color: ${theme.colors.textColor3};
  font-size: 12px;
  line-height: 1.4;
`

export const EmptyState = styled.div`
  height: 148px;
  border-radius: 14px;
  background-color: ${theme.colors.inputColor};
  color: ${theme.colors.textColor3};
  padding: 16px 14px;
  display: grid;
  place-items: center;
  text-align: center;
  line-height: 1.5;
`

export const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(19, 138, 172, 0.12);
  background-color: ${theme.colors.lightGray};
`

export const MapFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 20px;
  text-align: center;
  color: ${theme.colors.textColor3};
  background-color: rgba(255, 255, 255, 0.96);
`

export const MapLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(4px);
  z-index: 1;
`

export const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid rgba(19, 138, 172, 0.18);
  border-top-color: ${theme.colors.primary2};
  animation: ${spin} 0.8s linear infinite;
`

export const LoadingLabel = styled.span`
  color: ${theme.colors.textColor2};
  font-size: 13px;
  font-weight: 500;
`

export const MarkerLabel = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
  font-size: 12px;
  font-weight: 600;
`
