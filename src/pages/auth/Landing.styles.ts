import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

const text = '#214a57'
const teal = '#0d7894'

export const Page = styled.main`
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: ${text};
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0) 28rem),
    linear-gradient(180deg, #d9f4f3 0%, #eef9fb 26%, #f7fbfd 48%, #ecfbff 78%, #d6f3f7 100%);
`

export const Hero = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  padding: 0 clamp(24px, 11vw, 150px) 120px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(246, 247, 249, 0.1);
`

export const Nav = styled.nav`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  font-weight: 700;
  max-width: 1040px;
  width: 100%;
  margin: 84px auto 0;

  ${media.down(theme.breakPoints.tablet)} {
    gap: 10px;
    font-size: 12px;
  }
`

export const Tagline = styled.span`
  padding-left: 12px;
  border-left: 3px solid rgba(33, 74, 87, 0.35);
`

export const Logo = styled.span`
  display: inline-flex;
  align-items: center;

  svg {
    width: clamp(76px, 8vw, 100px);
    height: auto;
  }

  ${media.down(theme.breakPoints.tablet)} {
    svg {
      width: 72px;
    }
  }
`

export const HeroGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(150px, 200px) minmax(450px, 1.2fr);
  align-items: center;
  gap: clamp(40px, 8vw, 110px);
  max-width: 1040px;
  margin: 84px auto 0;

  ${media.down(theme.breakPoints.tablet)} {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 52px;
    margin-top: 70px;
  }
`

export const ScrollCue = styled.div`
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 10%;
  width: 112px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  animation: scrollCueFloat 2.4s ease-in-out infinite;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 18px;
    width: 48px;
    height: 7px;
    border-radius: 999px;
    background: rgb(235, 253, 255);
  }

  &::before {
    right: 48%;
    transform: rotate(30deg);
    transform-origin: right center;
  }

  &::after {
    left: 48%;
    transform: rotate(-30deg);
    transform-origin: left center;
  }

  ${media.down(theme.breakPoints.tablet)} {
    bottom: 5%;
    width: 72px;

    &::before,
    &::after {
      width: 34px;
      height: 5px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes scrollCueFloat {
    0%,
    100% {
      transform: translate(-50%, 0);
    }

    50% {
      transform: translate(-50%, -12px);
    }
  }
`

export const RobotSlot = styled.div<{ $compact?: boolean }>`
  width: ${({ $compact }) => ($compact ? '126px' : '142px')};
  aspect-ratio: 1;
  margin: ${({ $compact }) => ($compact ? '62px 0 48px' : '0')};
  position: relative;
  border-radius: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.86)) padding-box,
    linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(13, 120, 148, 0.14)) border-box;
  border: 1px solid transparent;
  box-shadow: 0 24px 40px rgba(13, 120, 148, 0.16);
  animation: ctaRobotFloat 3.4s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -28px;
    width: ${({ $compact }) => ($compact ? '82px' : '96px')};
    height: 16px;
    border-radius: 50%;
    background: rgba(13, 120, 148, 0.28);
    filter: blur(10px);
    transform: translateX(-50%);
    animation: ctaRobotShadow 3.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &::after {
      animation: none;
    }
  }

  @keyframes ctaRobotFloat {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-12px);
    }
  }

  @keyframes ctaRobotShadow {
    0%,
    100% {
      opacity: 0.9;
      transform: translateX(-50%) scale(1);
    }

    50% {
      opacity: 0.58;
      transform: translateX(-50%) scale(0.84);
    }
  }
`

export const RobotIconSlot = styled.div`
  width: 200px;
  aspect-ratio: 1;
  position: relative;
  border-radius: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 28px 44px rgba(13, 120, 148, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  animation: floatRobot 3.6s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -44px;
    width: 122px;
    height: 24px;
    border-radius: 50%;
    background: rgba(13, 120, 148, 0.34);
    filter: blur(12px);
    transform: translateX(-50%);
    animation: floatShadow 3.6s ease-in-out infinite;
  }

  @keyframes floatRobot {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-14px);
    }
  }

  @keyframes floatShadow {
    0%,
    100% {
      opacity: 0.95;
      transform: translateX(-50%) scale(1);
    }

    50% {
      opacity: 0.62;
      transform: translateX(-50%) scale(0.82);
    }
  }

  ${media.down(theme.breakPoints.tablet)} {
    width: 150px;
    border-radius: 44px;

    svg {
      width: 150px;
      height: 150px;
    }

    &::after {
      bottom: -34px;
      width: 92px;
      height: 18px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    &::after {
      animation: none;
    }
  }
`

export const Circle = styled.div<{
  $width: string
  $color: string
  $top: string
  $left: string
  $blur?: string
}>`
  position: absolute;
  z-index: 0;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $width }) => $width};
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(${({ $blur }) => $blur ?? '180px'});
  pointer-events: none;
  transform: translate(-50%, -50%);

  ${media.down(theme.breakPoints.tablet)} {
    width: min(${({ $width }) => $width}, 420px);
    filter: blur(${({ $blur }) => $blur ?? '120px'});
  }
`

export const BackgroundText = styled.h1`
  position: absolute;
  z-index: 0;
  top: 24px;
  right: 32px;
  margin: 0;
  color: rgba(255, 255, 255, 0.2);
  font-family: 'GmarketSansMedium', 'NanumSquare', sans-serif;
  font-size: clamp(120px, 12vw, 200px);
  letter-spacing: -0.02em;
  text-align: right;
  white-space: nowrap;
  pointer-events: none;

  ${media.down(theme.breakPoints.tablet)} {
    top: 70px;
    right: -18px;
    font-size: 76px;
    line-height: 0.9;
  }
`

export const BotFallbackBubble = styled.div`
  background: ${theme.colors.white || '#f1f3f5'};
  color: ${theme.colors.black || '#333333'};
  padding: 10px 14px;
  border-radius: 4px 16px 16px 16px;
  font-size: 14px;
  line-height: 1.8;
  font-weight: 400;
  width: fit-content;
  text-wrap: nowrap;
  box-shadow: 0 0 3.2px 0 rgba(0, 0, 0, 0.1);

  b {
    font-weight: 600;
  }

  button {
    color: ${theme.colors.primary2};
    background-color: rgba(235, 239, 239, 1);
    width: 100%;
    padding: 6px 12px;
    border-radius: 8px;
  }
`

export const ChatUserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export const ChatUserBubble = styled.div`
  max-width: 75%;
  padding: 10px 16px;
  border-radius: 16px 16px 4px 16px;
  background: ${theme.colors.primary2};
  color: ${theme.colors.white};
  font-size: 14px;
  line-height: 1.4;
  word-break: break-all;
`

export const ChatBotMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`

export const ChatBotContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 80%;
`

export const HeroCopy = styled.div`
  text-align: right;

  ${media.down(theme.breakPoints.tablet)} {
    text-align: center;
  }
`

export const HeroTitle = styled.h1`
  margin: 0;
  color: #123f50;
  font-family: 'GmarketSansMedium', 'NanumSquare', sans-serif;
  font-size: clamp(32px, 4vw, 46px);
  line-height: 1.25;
  letter-spacing: 0;

  span {
    display: inline-block;
    white-space: nowrap;
  }

  span + span {
    margin-left: 0.25em;
  }

  ${media.down(theme.breakPoints.tablet)} {
    max-width: 330px;
    font-size: 30px;
    line-height: 1.35;

    span + span {
      margin-left: 0;
    }
  }
`

export const HeroText = styled.p`
  margin: 36px 0 30px;
  color: rgba(33, 74, 87, 0.58);
  font-size: 16px;
  line-height: 2;

  ${media.down(theme.breakPoints.tablet)} {
    margin: 22px 0 26px;
    font-size: 14px;
    line-height: 1.8;
  }
`

export const StartLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 210px;
  height: 54px;
  border-radius: 999px;
  background: #087491;
  color: white;
  font-size: 15px;
  font-weight: 400;
  text-decoration: none;
  box-shadow: 0 16px 24px rgba(8, 116, 145, 0.24);
  cursor: pointer;
  transition:
    transform 190ms ease-in-out,
    box-shadow 180ms ease-in-out;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 18px 30px rgba(8, 116, 145, 0.3);
  }

  &:active {
    transform: scale(0.99);
  }

  &::after {
    content: '→';
    margin-left: 12px;
    font-size: 20px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }

  ${media.down(theme.breakPoints.tablet)} {
    min-width: 190px;
    height: 48px;
    font-size: 14px;
  }
`

export const Section = styled.section`
  max-width: 1030px;
  margin: 0 auto;
  padding: 180px 24px 88px;

  ${media.down(theme.breakPoints.tablet)} {
    padding: 96px 20px 56px;
  }
`

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 92px;
  color: #5f6a70;
  font-family: 'GmarketSansMedium', 'NanumSquare', sans-serif;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.25;
  letter-spacing: 0;

  svg {
    flex: 0 0 auto;
    display: block;
    align-self: center;
  }

  ${media.down(theme.breakPoints.tablet)} {
    justify-content: center;
    margin-bottom: 64px;
    text-align: center;
    font-size: 24px;
    line-height: 1.4;

    svg {
      display: none;
    }
  }
`

export const FeatureCopy = styled.div<{ $reverse: boolean }>`
  order: ${({ $reverse }) => ($reverse ? 2 : 1)};
  text-align: ${({ $reverse }) => ($reverse ? 'right' : 'left')};

  ${media.down(theme.breakPoints.tablet)} {
    order: initial;
    text-align: center;
  }
`

export const FeatureTitle = styled.h3`
  margin: 0 0 28px;
  color: ${teal};
  font-family: 'GmarketSansMedium', 'NanumSquare', sans-serif;
  font-size: clamp(23px, 2.5vw, 30px);
  letter-spacing: 0;

  ${media.down(theme.breakPoints.tablet)} {
    margin-bottom: 18px;
    font-size: 22px;
  }
`

export const FeatureText = styled.p`
  margin: 10px 0 0;
  color: rgba(33, 74, 87, 0.68);
  font-size: 16px;
  line-height: 1.7;

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 14px;
    line-height: 1.65;
  }
`

export const ImageSlot = styled.div<{ $reverse: boolean; $type: string }>`
  order: ${({ $reverse }) => ($reverse ? 1 : 2)};
  width: ${({ $type }) => ($type === 'todo' ? '360px' : '100%')};
  max-width: ${({ $type }) => ($type === 'todo' ? '360px' : '440px')};
  min-height: ${({ $type }) => ($type === 'todo' ? '124px' : '178px')};
  justify-self: center;
  position: relative;
  overflow: ${({ $type }) => ($type === 'todo' ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ $type }) => ($type === 'todo' ? '36px' : '42px')};
  background: ${({ $type }) =>
    $type === 'chat'
      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(238, 251, 255, 0.72)) padding-box,
    linear-gradient(135deg, rgba(13, 120, 148, 0.12), rgba(255, 255, 255, 0.7)) border-box`
      : 'transparent'};
  border: ${({ $type }) => ($type === 'chat' ? '1px solid transparent' : '0')};
  box-shadow: ${({ $type }) =>
    $type === 'chat'
      ? `0 22px 42px rgba(13, 120, 148, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.88)`
      : 'none'};

  ${media.down(theme.breakPoints.tablet)} {
    order: initial;
    width: min(100%, 340px);
    max-width: 340px;
    min-height: ${({ $type }) => ($type === 'todo' ? '108px' : '150px')};
    border-radius: ${({ $type }) => ($type === 'todo' ? '28px' : '34px')};
  }
`

export const LandingChatPreview = styled.div<{ $reverse: boolean }>`
  order: ${({ $reverse }) => ($reverse ? 1 : 2)};
  width: 100%;
  max-width: 440px;
  min-height: 178px;
  justify-self: center;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;

  > div:last-of-type {
    max-width: 78%;
  }

  svg {
    flex: 0 0 auto;
  }

  > div {
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 520ms ease,
      transform 520ms ease;
  }

  [data-visible='true'] & > div:first-of-type {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 240ms;
  }

  [data-visible='true'] & > div:last-of-type {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 520ms;
  }

  @media (prefers-reduced-motion: reduce) {
    > div {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  ${media.down(theme.breakPoints.tablet)} {
    order: initial;
    max-width: 340px;
    padding: 20px;

    > div:last-of-type {
      max-width: 92%;
    }
  }
`

export const LandingSuggestionCard = styled.div<{ $reverse: boolean }>`
  order: ${({ $reverse }) => ($reverse ? 1 : 2)};
  width: min(88%, 340px);
  justify-self: center;
  padding: 20px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(13, 120, 148, 0.1);

  ${media.down(theme.breakPoints.tablet)} {
    order: initial;
  }
`

export const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

export const SuggestionTag = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin-bottom: 0;
  padding: 6px 14px;
  border-radius: 14px;
  background: linear-gradient(90deg, #4684c1 0%, #00dccc 100%);
  background-clip: text;
  color: transparent;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(90deg, #4684c1 0%, #00dccc 100%);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
  }
`

export const SuggestionText = styled.p`
  margin: 0;
  color: #1e293b;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.55;
`

export const SuggestionButtonRow = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 16px;
`

export const SuggestionGhostButton = styled.button`
  flex: 1;
  padding: 9px 12px;
  border: 0;
  border-radius: 9px;
  background: #fafafa;
  color: #3da4b2;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`

export const SuggestionPrimaryButton = styled(SuggestionGhostButton)`
  background: #4490b4;
  color: #ffffff;
`

export const ShareCardPreview = styled.div<{ $reverse: boolean }>`
  order: ${({ $reverse }) => ($reverse ? 1 : 2)};
  width: min(100%, 380px);
  justify-self: center;
  overflow: hidden;
  border-radius: 22px;
  background: #f7f7f8;
  box-shadow: 0 22px 42px rgba(89, 79, 202, 0.1);

  ${media.down(theme.breakPoints.tablet)} {
    order: initial;
    width: min(100%, 340px);
    border-radius: 22px;
  }
`

export const ShareHeader = styled.div`
  height: 56px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ecebff;
`

export const ShareTitle = styled.h4`
  margin: 0;
  color: #6b5bd3;
  font-size: 16px;
  letter-spacing: 0;
  font-weight: 600;
`

export const ShareCount = styled.span`
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #6b5bd3;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  font-weight: 400;
  font-family: 'NanumSquare';
`

export const ShareCard = styled.div`
  margin: 14px;
  padding: 16px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);

  ${media.down(theme.breakPoints.tablet)} {
    margin: 14px;
    padding: 16px;
    border-radius: 20px;
  }
`

export const ShareInviteRow = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 104px;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`

export const ShareAvatar = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: #eeeeef;
  color: #87888a;
  font-size: 24px;
  font-weight: 900;
`

export const ShareInviteText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #202427;
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #7c7f84;
    font-size: 12px;
    font-weight: 500;
  }
`

export const ShareActions = styled.div`
  display: flex;
  gap: 8px;

  button {
    min-width: 48px;
    height: 30px;
    border: 0;
    border-radius: 15px;
    background: #f1f1f2;
    color: #777a7f;
    font-size: 12px;
    font-weight: 600;
  }

  button:last-of-type {
    background: #ecebff;
    color: #6b5bd3;
  }
`

export const ShareDetail = styled.div`
  padding: 14px 18px;
  border-radius: 18px;
  background: #fffdf6;
`

export const ShareDetailTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  color: #1e2327;
  font-size: 14px;
  font-weight: 900;

  span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #f4d144;
  }
`

export const ShareMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 10px;
  color: #7b7f84;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;

  svg {
    width: 18px;
    height: 18px;
    color: #85888d;
    flex: 0 0 auto;
  }

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 12px;
    gap: 10px;
  }
`

export const TodoPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  color: #8ccbd7;
`

export const IconTile = styled.div`
  width: 84px;
  aspect-ratio: 1;
  border-radius: 26px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 14px 24px rgba(13, 120, 148, 0.12);
  font-size: 42px;
  font-weight: 900;
  svg {
    width: 80%;
    height: 80%;
  }
`

export const PlusMark = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.56);
  font-size: 26px;
  font-weight: 300;
`

export const FeatureRow = styled.article<{ $align: string }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(36px, 8vw, 110px);
  min-height: 330px;
  margin-bottom: 74px;

  > * {
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 620ms ease,
      transform 620ms ease;
  }

  &[data-visible='true'] > * {
    opacity: 1;
    transform: translateY(0);
  }

  &[data-visible='true'] > *:last-child {
    transition-delay: 180ms;
  }

  @media (prefers-reduced-motion: reduce) {
    > * {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  ${media.down(theme.breakPoints.tablet)} {
    grid-template-columns: 1fr;
    gap: 30px;
    min-height: auto;
    margin-bottom: 86px;
  }
`

export const Cta = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 86px 24px 96px;
  text-align: center;

  ${media.down(theme.breakPoints.tablet)} {
    padding: 64px 20px 78px;
  }
`

export const CtaTitle = styled.h2`
  margin: 0;
  color: #69777e;
  font-family: 'GmarketSansMedium', 'NanumSquare', sans-serif;
  font-size: clamp(27px, 3vw, 36px);
  letter-spacing: 0;

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 25px;
    line-height: 1.4;
  }
`

export const CtaText = styled.p`
  margin: 0 0 36px;
  color: rgba(33, 74, 87, 0.68);
  font-size: 16px;
  line-height: 2;

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 14px;
  }
`

export const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  width: 100%;

  ${media.down(theme.breakPoints.tablet)} {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`
export const SocialButton = styled.button`
  min-width: 240px;
  height: 54px;
  border-radius: 20px;
  border: none;
  margin-bottom: 16px;
  padding: 0 30px;
  gap: 12px;

  display: flex;
  align-items: center;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  /* 부드러운 상호작용 */
  transition:
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    filter 0.2s,
    box-shadow 0.3s;

  &:hover {
    transform: scale(1.03); /* 마우스 올리면 말랑하게 부풀어 오름 */
    filter: brightness(0.95);
  }

  &:active {
    transform: scale(0.98); /* 누르면 꾹 짜지는 느낌 */
  }
`

export const Google = styled(SocialButton)`
  background: rgba(255, 255, 255, 0.8);
  color: #222;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.9),
    0 4px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.9),
      0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

export const Kakao = styled(SocialButton)`
  background: #fee500;
  color: #181600;
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.5),
    0 4px 10px rgba(254, 229, 0, 0.3);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.5),
      0 8px 15px rgba(254, 229, 0, 0.4);
  }
`

export const Naver = styled(SocialButton)`
  background: #2db400;
  color: white;
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.3),
    0 4px 10px rgba(45, 180, 0, 0.3);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.3),
      0 8px 15px rgba(45, 180, 0, 0.4);
  }
`

export const Footer = styled.footer`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 128px;
  min-width: 100%;
  padding: 0 clamp(24px, 9vw, 124px);
  background: #086b80;
  color: rgba(255, 255, 255, 0.88);

  ${media.down(theme.breakPoints.tablet)} {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 32px 24px;
  }
`

export const FooterCopyright = styled.span`
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;

  ${media.down(theme.breakPoints.tablet)} {
    position: static;
    transform: none;
    order: 3;
  }
`

export const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-left: 3px solid rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  height: 20px;
`

export const FooterLogo = styled(Logo)`
  svg {
    width: 80px;
    height: auto;
  }

  ${media.down(theme.breakPoints.tablet)} {
    svg {
      width: 64px;
    }
  }
`

export const FooterLinks = styled.div`
  display: flex;
  gap: 34px;

  button,
  a {
    border: 0;
    padding: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
  }

  ${media.down(theme.breakPoints.tablet)} {
    width: 100%;
    justify-content: space-between;
    gap: 14px;
  }
`
