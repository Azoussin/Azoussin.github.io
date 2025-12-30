import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Bot, Shield } from "lucide-react"

/**
 * Dashboard page
 * Main landing page after authentication showing overview and quick stats
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Create your first note
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Stored</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Upload your first file
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start a conversation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              All data encrypted
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick guide to help you get the most out of VAUL AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Create Notes</h3>
              <p className="text-sm text-muted-foreground">
                Organize your thoughts and ideas with our powerful note-taking system.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Upload className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Store and manage your important documents securely in the cloud.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Bot className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Use AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get help with summarizing notes, rewriting text, and generating ideas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
