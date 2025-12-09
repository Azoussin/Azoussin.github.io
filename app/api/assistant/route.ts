import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

/**
 * API route for AI Assistant
 * Handles chat completions with OpenAI and saves conversation history
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for VAUL AI. You help users with summarizing notes, rewriting text, generating ideas, and general assistance. Be concise and helpful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    // Save to conversation history
    const { error: dbError } = await supabase
      .from("ai_history")
      .insert([
        {
          user_id: user.id,
          prompt: prompt,
          response: response,
        },
      ])

    if (dbError) {
      console.error("Error saving conversation history:", dbError)
    }

    return NextResponse.json({ response })
  } catch (error: unknown) {
    console.error("Error in AI assistant:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    )
  }
}
