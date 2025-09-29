// CheckEmailPage.jsx
import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useLocation } from 'react-router-dom'

export default function CheckEmailPage() {
  const { search } = useLocation()
  const email = useMemo(() => new URLSearchParams(search).get('email') || '', [search])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const resend = async () => {
    setMsg(null)
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setMsg({ ok: true, text: 'Verification email sent again' })
    } catch (e) {
      setMsg({ ok: false, text: e.message || 'Failed to resend' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We sent a verification link to {email}</CardDescription>
      </CardHeader>
      <CardContent className='flex gap-3 items-center'>
        <Button onClick={resend} disabled={loading || !email}>
          {loading ? 'Sending...' : 'Resend email'}
        </Button>
        {msg && (
          <Alert variant={msg.ok ? 'default' : 'destructive'}>
            <AlertTitle>{msg.ok ? 'Done' : 'Error'}</AlertTitle>
            <AlertDescription>{msg.text}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
