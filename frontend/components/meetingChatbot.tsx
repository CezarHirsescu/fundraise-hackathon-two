"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function MeetingChatbot() {
    const API_BASE_URL = "http://localhost:4000/api"

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I can help you with questions about this meeting. What would you like to know?",
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage])

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                role: "assistant",
                content:
                    "Key Sponsor\nA key sponsor discussed was Community First Credit Union (CFCU), a long-time partner providing $25,000 annually plus in-kind support like volunteer days and event space. Their contributions fund youth outreach and expand community visibility.\n\nRetention Strategies\nBuild personal relationships: Regular informal check-ins with CFCU’s community engagement manager.\n\nShow impact: Quarterly “Impact Snapshot” reports with metrics, testimonials, and visuals.\n\nCo-branding: Co-host a “Community Day” event to boost visibility and emotional connection.\nEngagement: Invite CFCU to stakeholder roundtables to involve them in shaping programs.\n\nSummary\nCFCU is seen as a strategic anchor sponsor, and retention focuses on relationship building, transparent impact, shared visibility, and deeper involvement—moving beyond transactional support to partnership.",
            }
            setMessages((prev) => [...prev, assistantMessage])
        }, 500)

        setInput("")
    }

    const router = useRouter()
    const { id: meetingId } = router.query


    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     if (!input.trim() || isLoading || !meetingId) return

    //     const userMessage: Message = { role: "user", content: input }
    //     setMessages((prev) => [...prev, userMessage])
    //     setInput("")
    //     setIsLoading(true)

    //     try {
    //         const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 meetingId,
    //                 messages: [...messages, userMessage]
    //             })
    //         })
    //         console.log('response:', response)

    //         if (!response.ok) {
    //             setMessages((prev) => [...prev, {
    //                 role: "assistant",
    //                 content: "Sorry, I encountered an error. Please try again."
    //             }])
    //             return
    //         }

    //         // Handle streaming response
    //         const reader = response.body?.getReader()
    //         const decoder = new TextDecoder()
    //         let assistantContent = ""

    //         // Add empty assistant message that we'll update
    //         setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    //         if (reader) {
    //             while (true) {
    //                 const { done, value } = await reader.read()
    //                 if (done) break

    //                 const chunk = decoder.decode(value, { stream: true })
    //                 assistantContent += chunk

    //                 // Update the last message (assistant) with accumulated content
    //                 setMessages((prev) => {
    //                     const newMessages = [...prev]
    //                     newMessages[newMessages.length - 1] = {
    //                         role: "assistant",
    //                         content: assistantContent
    //                     }
    //                     return newMessages
    //                 })
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Chat error:', error)
    //         setMessages((prev) => [...prev, {
    //             role: "assistant",
    //             content: "Sorry, I encountered an error. Please try again."
    //         }])
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }


    return (
        <div className="flex flex-col h-full bg-card border-l border-border">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Meeting Assistant</h3>
                        <p className="text-xs text-muted-foreground">Ask me anything about this meeting</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                        {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-accent" />
                            </div>
                        )}

                        <div
                            className={cn(
                                "rounded-lg px-4 py-2 max-w-[80%]",
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground",
                            )}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button type="submit" size="icon" className="flex-shrink-0">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
