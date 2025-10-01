// VerifyEmailPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function VerifyEmailPage() {
  const { search } = useLocation()
  const token = useMemo(() => new URLSearchParams(search).get('token') || '', [search])
  const [state, setState] = useState({ loading: true, ok: false, msg: '' })

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState({ loading: false, ok: false, msg: 'Missing token' })
        return
      }
      try {
        // основной вариант: POST с JSON { token }
        let res = await fetch('https://massivemarketmanager.de/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        // запасной: если бэк ждёт query param
        if (!res.ok && res.status === 400) {
          res = await fetch(`https://massivemarketmanager.de/api/auth/verify?token=${encodeURIComponent(token)}`, { method: 'POST' })
        }

        const isJson = res.headers.get('content-type')?.includes('application/json')
        const payload = isJson ? await res.json() : await res.text()

        if (!res.ok) {
          const msg = typeof payload === 'string' ? payload : payload?.detail || payload?.message || `HTTP ${res.status}`
          throw new Error(msg)
        }

        setState({ loading: false, ok: true, msg: 'Email verified. You can sign in now.' })
      } catch (e) {
        setState({ loading: false, ok: false, msg: e.message || 'Verification failed' })
      }
    }
    run()
  }, [token])

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
        <CardDescription>{state.loading ? 'Verifying...' : state.ok ? 'Success' : 'Failed'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant={state.ok ? 'default' : 'destructive'}>
          <AlertTitle>{state.ok ? 'Verified' : 'Error'}</AlertTitle>
          <AlertDescription>{state.msg}</AlertDescription>
        </Alert>
        {state.ok && (
          <div className='mt-4'>
            <Link className='underline' to='/auth/sign-in'>Go to Sign In</Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
