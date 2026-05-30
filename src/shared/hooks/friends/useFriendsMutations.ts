import { useMutation, useQueryClient } from '@tanstack/react-query'

import { friendApi, friendRequestApi } from '@/shared/api/friends/friends'

export function useFriendMutations() {
  const queryClient = useQueryClient()

  // 1. 친구 요청 수락 Mutation
  const acceptMutation = useMutation({
    mutationFn: (friendRequestId: number) => friendRequestApi.acceptRequest({ friendRequestId }),
    onSuccess: () => {
      // 친구 목록과 받은 요청 목록을 모두 갱신
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] })
      alert('친구 요청을 수락했습니다.')
    },
    onError: () => alert('요청 수락 중 오류가 발생했습니다.'),
  })

  // 2. 친구 요청 거절 Mutation
  const rejectMutation = useMutation({
    mutationFn: (friendRequestId: number) => friendRequestApi.rejectRequest({ friendRequestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] })
      alert('친구 요청을 거절했습니다.')
    },
    onError: () => alert('요청 거절 중 오류가 발생했습니다.'),
  })

  // 3. 친구 삭제 Mutation
  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: number) => friendApi.deleteFriend({ friendId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      alert('친구를 삭제했습니다.')
    },
    onError: () => alert('친구 삭제 중 오류가 발생했습니다.'),
  })

  // 컴포넌트에서 실행할 함수들을 반환합니다.
  return {
    handleAccept: (id: number) => acceptMutation.mutate(id),
    handleReject: (id: number) => rejectMutation.mutate(id),
    handleDeleteFriend: (id: number) => {
      if (window.confirm('정말 이 친구를 삭제하시겠습니까?')) {
        deleteFriendMutation.mutate(id)
      }
    },
    // 필요 시 로딩 상태(isPending) 등도 함께 반환하여 UI에 적용할 수 있습니다.
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isDeleting: deleteFriendMutation.isPending,
  }
}
