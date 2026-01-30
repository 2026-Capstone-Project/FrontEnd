import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  background-color: #fafafa;
  justify-content: center;
  border-bottom: 1px solid #f1f3f5;
  margin-bottom: 40px;
`

export const HeaderContent = styled.header`
  width: 100%;
  max-width: 800px;
  padding: 40px 24px;
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #000;
  }

  p {
    font-size: 20px;
    color: #000;
    margin: 0;
  }
`

export const Content = styled.main`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`

export const Section = styled.section`
  background: #ffffff;
  margin-bottom: 24px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
`

export const SectionTitle = styled.div`
  padding: 16px 30px;
  width: 100%;
  background-color: #eef6f8;
  color: ${theme.colors.textPrimary};
  font-size: 20px;
  font-weight: 700;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }

  span {
    font-size: 16px;
    color: #757575;
  }
`
export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ProviderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
`

export const Name = styled.div`
  font-size: 20px;
  font-weight: 600;
`

export const ProviderIcon = styled.div`
  width: 14px;
  height: 14px;
`

export const Email = styled.div`
  font-size: 16px;
  color: #000;
`

export const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%235D5D5D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;

  width: auto;
  padding: 10px 40px 10px 16px;
  font-size: 16px;
  border: 1px solid #5d5d5d;
  border-radius: 8px;
  background-color: white;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007aff;
  }
`

export const Button = styled.button<{ variant?: 'danger' }>`
  padding: 8px 16px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  color: ${({ variant, theme }) => (variant === 'danger' ? theme.colors.red : '#5d5d5d')};

  border: 1px solid ${({ variant, theme }) => (variant === 'danger' ? theme.colors.red : '#5d5d5d')};

  &:hover {
    background-color: #f8f9fa;
  }

  &:active {
    opacity: 0.8;
  }
`

export const Toggle = styled.input`
  appearance: none;
  width: 44px;
  height: 22px;
  background: #ccc;
  border-radius: 11px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;

  &:checked {
    background: ${theme.colors.primary2};
  }

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background: white;
    transition: 0.3s;
  }

  &:checked::before {
    left: 24px;
  }
`
