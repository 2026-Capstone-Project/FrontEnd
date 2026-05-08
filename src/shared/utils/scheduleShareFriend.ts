import type { ScheduleShareFriend } from '@/shared/types/schedule/shareFriend'

export const filterScheduleShareFriends = (
  friends: ScheduleShareFriend[],
  keyword: string,
): ScheduleShareFriend[] => {
  const trimmedKeyword = keyword.trim().toLowerCase()

  if (!trimmedKeyword) return []

  return friends.filter(
    (friend) =>
      friend.userName.toLowerCase().includes(trimmedKeyword) ||
      friend.email.toLowerCase().includes(trimmedKeyword),
  )
}
