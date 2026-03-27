import { theme } from '@/shared/styles/theme'
import { getPriorityColor, translatePriority } from '@/shared/utils/priority'

import * as S from './PriorityBadge.style'
const PriorityBadge = ({ priority }: { priority: 'HIGH' | 'MEDIUM' | 'LOW' }) => {
  const color = getPriorityColor(priority)
  const { base, point } = theme.colors.priority[color]
  const label = translatePriority(priority)
  return (
    <S.Badge baseColor={base} pointColor={point}>
      {label}
    </S.Badge>
  )
}

export default PriorityBadge
