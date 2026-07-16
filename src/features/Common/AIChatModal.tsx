import { useQueryClient, useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'

import ChatIcon from '@/assets/icons/common/chat.svg'
import RobotIcon from '@/assets/icons/common/robot.svg'
import { nlpApi } from '@/shared/api/home/home'
import type { ChatMessage } from '@/shared/types/home/home'
import { SparkleIcon } from '@/shared/ui/icons/SparkleIcon'

import * as S from './AIChatModal.styles'

interface AIChatModalProps {
  isHome?: boolean
}

function AIChatModal({ isHome = true }: AIChatModalProps) {
  const queryClient = useQueryClient()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: nlpApi.getHistory,
  })

  useEffect(() => {
    if (historyData?.isSuccess && historyData.result) {
      const rawMessages = historyData.result.messages
      const mappedMessages: ChatMessage[] = Array.isArray(rawMessages)
        ? rawMessages.map((msg) => ({
            id: crypto.randomUUID(),
            sender: msg.role === 'user' ? 'user' : 'bot',
            text: msg.content ?? '',
          }))
        : []

      setMessages(mappedMessages)
    }
  }, [historyData])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, isLoading, isHistoryLoading])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userText = inputValue
    setInputValue('')

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userText,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await nlpApi.sendMessage(userText)

      if (response.isSuccess && response.result) {
        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: response.result.reply,
          action: response.result.action,
        }
        setMessages((prev) => [...prev, botMessage])

        queryClient.invalidateQueries({ queryKey: ['chatHistory'] })

        if (response.result.action === 'UPDATED') {
          queryClient.invalidateQueries({ queryKey: ['calendar'] })
          queryClient.invalidateQueries({ queryKey: ['events'] })
          queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'bot',
            text: response.message || '죄송해요, 잠시 대화를 이해하지 못했어요.',
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: 'AI 비서 서버와 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const isChatEmpty = messages.length === 0 && !isLoading && !isHistoryLoading
  const hideEmptyChatBox = !isHome && isChatEmpty

  return (
    <S.Container isCompact={hideEmptyChatBox}>
      <S.Title>
        <S.IconWrapper>
          <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={24} />
        </S.IconWrapper>
        AI 비서에게 일정을 맡기세요
      </S.Title>

      <S.ChatBox ref={chatBoxRef} isEmpty={isChatEmpty} isHidden={hideEmptyChatBox}>
        {isHistoryLoading ? (
          <S.BotMessageWrapper>
            <img src={RobotIcon} width={32} height={32} style={{ flexShrink: 0 }} alt="robot" />
            <S.BotContentArea>
              <S.BotFallbackBubble>잠시만 기다려주세요...</S.BotFallbackBubble>
            </S.BotContentArea>
          </S.BotMessageWrapper>
        ) : isChatEmpty ? (
          <S.EmptyState>
            <img src={ChatIcon} alt="채팅 시작" width="150" height="150" />
          </S.EmptyState>
        ) : (
          <>
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <S.UserMessageWrapper key={msg.id}>
                    <S.UserBubble>{msg.text}</S.UserBubble>
                  </S.UserMessageWrapper>
                )
              }

              return (
                <S.BotMessageWrapper key={msg.id}>
                  <img
                    src={RobotIcon}
                    width={32}
                    height={32}
                    style={{ flexShrink: 0 }}
                    alt="robot"
                  />
                  <S.BotContentArea>
                    <S.BotFallbackBubble>{msg.text}</S.BotFallbackBubble>
                  </S.BotContentArea>
                </S.BotMessageWrapper>
              )
            })}

            {isLoading && (
              <S.BotMessageWrapper>
                <img src={RobotIcon} width={32} height={32} style={{ flexShrink: 0 }} alt="robot" />
                <S.BotContentArea>
                  <S.BotFallbackBubble>답변을 생각하고 있습니다...</S.BotFallbackBubble>
                </S.BotContentArea>
              </S.BotMessageWrapper>
            )}
          </>
        )}
      </S.ChatBox>

      <S.InputWrapper>
        <S.Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예시) 내일 오후 3시 치과 진료 받으러 감"
          disabled={isLoading || isHistoryLoading}
        />
        <S.SendButton
          onClick={handleSendMessage}
          disabled={isLoading || isHistoryLoading || !inputValue.trim()}
          aria-label="전송"
        >
          ↑
        </S.SendButton>
      </S.InputWrapper>
    </S.Container>
  )
}

export default AIChatModal
