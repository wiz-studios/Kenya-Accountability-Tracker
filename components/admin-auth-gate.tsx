"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import { Shield } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AdminRole = "admin" | "reviewer"

type AdminAccessContext = {
  accessToken: string
  role: AdminRole
  reviewerLabel: string
  signOut: () => Promise<void>
}

type AdminAuthGateProps = {
  title: string
  children: (context: AdminAccessContext) => ReactNode
}

const resolveRole = (session: Session | null): AdminRole | null => {
  if (!session?.user) return null
  const raw = (session.user.app_metadata?.role || session.user.user_metadata?.role || "").toString().toLowerCase()
  if (raw === "admin" || raw === "reviewer") return raw
  return null
}

export function AdminAuthGate({ title, children }: AdminAuthGateProps) {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [clientError, setClientError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signInBusy, setSignInBusy] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient()
      setClient(supabase)
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session ?? null)
        setLoading(false)
      })
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        setLoading(false)
      })
      return () => data.subscription.unsubscribe()
    } catch (error) {
      setClientError(error instanceof Error ? error.message : "Supabase client is not configured")
      setLoading(false)
      return () => undefined
    }
  }, [])

  const role = useMemo(() => resolveRole(session), [session])

  const handleSignIn = async () => {
    if (!client) return
    setSignInBusy(true)
    setSignInError(null)
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      if (!data.session) throw new Error("No active session returned")
      setSession(data.session)
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : "Sign-in failed")
    } finally {
      setSignInBusy(false)
    }
  }

  const handleSignOut = async () => {
    if (!client) return
    await client.auth.signOut()
    setSession(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-8 text-sm text-muted-foreground">Checking admin session...</CardContent>
        </Card>
      </div>
    )
  }

  if (clientError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Auth Configuration Required</CardTitle>
            <CardDescription>Admin routes require a configured Supabase browser client.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{clientError}</CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-foreground" />
              <CardTitle>Reviewer Sign In</CardTitle>
            </div>
            <CardDescription>Authenticate to access {title} controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {signInError && (
              <div className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {signInError}
              </div>
            )}
            <Button className="w-full" disabled={signInBusy || !email || !password} onClick={handleSignIn}>
              {signInBusy ? "Signing in..." : "Sign in"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Your account does not have reviewer privileges.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const accessToken = session.access_token
  if (!accessToken) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-8 text-sm text-muted-foreground">
            Session token missing. Sign out and sign in again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{role}</Badge>
            <span className="text-muted-foreground">{session.user.email || "Reviewer session"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
      {children({
        accessToken,
        role,
        reviewerLabel: session.user.email || role,
        signOut: handleSignOut,
      })}
    </div>
  )
}
