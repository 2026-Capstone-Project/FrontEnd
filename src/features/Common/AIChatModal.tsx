import React, { useEffect, useRef, useState } from 'react'

import { nlpApi } from '@/shared/api/home/home'
import ChatIcon from '@/shared/assets/icons/chat.svg'
import RobotIcon from '@/shared/assets/icons/robot.svg'
import type { ChatMessage } from '@/shared/types/home/home'

import { SparkleIcon } from '../Home/Icon/SparkleIcon'
import * as S from './AIChatModal.styles'

function AIChatModal() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, isLoading])

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const isChatEmpty = messages.length === 0 && !isLoading

  return (
    <S.Container>
      <S.Title>
        <S.IconWrapper>
          <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={24} />
        </S.IconWrapper>
        AI 비서에게 일정을 맡기세요
      </S.Title>

      <S.ChatBox ref={chatBoxRef} isEmpty={isChatEmpty}>
        {isChatEmpty ? (
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
          disabled={isLoading}
        />
        <S.SendButton
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          aria-label="전송"
        >
          ↑
        </S.SendButton>
      </S.InputWrapper>
    </S.Container>
  )
}

export default AIChatModal
