export const colors = {
  primary: '#3EABCA', // --Primary-Color
  primary2: '#138AAC', // --Primary-Color-2
  sub: '#E9F4F7', // --Sub-Color

  textPrimary: '#025A74', // --Text-Color-1
  textColor2: '#505050', // --Text-Color-2
  textColor3: '#757575', // --Text-Color-3
  inputColor: '#F7F7F7',
  red: '#080505', // --Red

  white: '#FDFDFD', // 메뉴 탭
  background: '#FAFAFA', // 전체 바탕
  black: '#111827', // 모든 블랙 대체
  lightGray: '#F5F5F5', // 라이트 그레이

  /* 스케줄 관련 색상 등록 */
  sky: { base: '#dcecfc', point: '#94c8ff' },
  mint: { base: '#dcf2ec', point: '#8fd2c0' },
  pink: { base: '#ffebe8', point: '#f5b4aa' },
  violet: { base: '#f1ebf9', point: '#c9b0f0' },
  yellow: { base: '#fff0b3', point: '#f4d144' },
  gray: { base: '#e9e9e9', point: '#757575' },

  priority: {
    red: {
      base: '#fbe2e1',
      point: '#bd3730',
    },
    green: {
      base: '#dcf2ec',
      point: '#089b43',
    },
    yellow: {
      base: '#fff0b3',
      point: '#8e7d02',
    },
  },
}

/* 그라데이션 등록 */
export const gradients = {
  default: 'linear-gradient(90deg, #DEECEC 0%, #9ECFDD 100%)',

  ai: 'linear-gradient(112deg, #4784C1 0%, #6BDAD2 100%)',
}

/* 폰트 스타일 */
export const fonts = {
  main: `'Pretendard', system-ui, -apple-system, sans-serif`,
}

export const breakPoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
}

export const theme = {
  colors,
  gradients,
  fonts,
  breakPoints,
}
