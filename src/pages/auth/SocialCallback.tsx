import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export default function SocialCallback() {
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  useEffect(() => {
    if (!provider || !code || !state) return
    const SERVER_URL = import.meta.env.VITE_SERVER_URL
    const upperProvider = provider.toUpperCase()
    const callbackUrl = `${SERVER_URL}/api/v1/auth/${upperProvider}/callback?code=${code}&state=${state}`

    window.location.href = callbackUrl
  }, [provider, code, state])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <p>로그인 중 잠시만 기다려주세요...</p>
    </div>
  )
}
