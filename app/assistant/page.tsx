"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  prompt: string
  response: string
  created_at: string
}

/**
 * AI Assistant page component
 * Provides an interface to interact with the OpenAI-powered assistant
 */
export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from("ai_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(50)

      if (error) {
        console.error("Error fetching history:", error)
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setHistoryLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return

    const userPrompt = prompt
    setPrompt("")
    setLoading(true)

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      })

      const data = await response.json()

      if (response.ok) {
        // Add the new message to the local state
        const newMessage: Message = {
          id: Date.now().toString(),
          prompt: userPrompt,
          response: data.response,
          created_at: new Date().toISOString(),
        }
        setMessages([...messages, newMessage])
      } else {
        console.error("Error from API:", data.error)
        alert(data.error || "Failed to get response from assistant")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading assistant...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get help with summarizing, rewriting, and generating ideas
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat with AI</CardTitle>
          <CardDescription>
            Ask questions, summarize notes, or get creative ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Start a conversation with your AI assistant
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  {/* User message */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm whitespace-pre-wrap">{message.prompt}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={3}
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !prompt.trim()}
              size="icon"
              className="h-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
