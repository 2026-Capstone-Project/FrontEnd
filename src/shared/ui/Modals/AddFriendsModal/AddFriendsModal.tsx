/** @jsxImportSource @emotion/react */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useState } from 'react'

import { friendRequestApi } from '@/shared/api/friends/friends'
import { theme } from '@/shared/styles'

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [requestForm, setRequestForm] = useState({ name: '', email: '' })

  const queryClient = useQueryClient()

  const sendRequestMutation = useMutation({
    mutationFn: friendRequestApi.sendRequest,
    onSuccess: (res) => {
      if (res.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] })

        alert('친구 요청을 성공적으로 보냈습니다!')
        handleClose()
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || '친구 요청 전송에 실패했습니다.'
      alert(errorMessage)
    },
  })
  const handleClose = () => {
    onClose()
    setRequestForm({ name: '', email: '' })
  }

  const handleSendRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.name.trim() || !requestForm.email.trim()) {
      alert('이름과 이메일을 모두 입력해 주세요.')
      return
    }
    sendRequestMutation.mutate(requestForm)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '24px',
          width: '360px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#000',
            textAlign: 'center',
          }}
        >
          친구 요청하기
        </h3>
        <form
          onSubmit={handleSendRequestSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#666',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              이름
            </label>
            <input
              type="text"
              placeholder="상대방의 이름을 입력하세요"
              value={requestForm.name}
              onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #eee',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#666',
                marginBottom: '6px',
                fontWeight: 600,
              }}
            >
              이메일 주소
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={requestForm.email}
              onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #eee',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: theme.colors.sub,
                color: theme.colors.primary2,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={sendRequestMutation.isPending}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: theme.colors.primary2,
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {sendRequestMutation.isPending ? '전송 중...' : '요청 전송'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
