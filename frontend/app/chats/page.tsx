"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  role: string
  firstName: string
  lastName: string
}

interface Chat {
  id: number
  teacher: User
  student: User
  subject: string
  createdAt: string
  lastMessageAt: string
  active: boolean
}

export default function ChatsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats", {
        credentials: "include",
      })

      if (response.ok) {
        const chatsData = await response.json()
        setChats(chatsData)
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChats = chats.filter((chat) => {
    const otherUser = user?.role === "TEACHER" ? chat.student : chat.teacher
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase()
    const subject = chat.subject.toLowerCase()
    const search = searchTerm.toLowerCase()

    return fullName.includes(search) || subject.includes(search)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a189a] mx-auto mb-4"></div>
          <p className="text-[#3c096c]">Loading chats...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#c77dff]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-[#5a189a] hover:bg-[#e0aaff]/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-[#5a189a]" />
              <h1 className="text-xl font-semibold text-[#240046]">Messages</h1>
            </div>
          </div>

          <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5a189a] h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf] bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Chats List */}
          {filteredChats.length > 0 ? (
            <div className="space-y-4">
              {filteredChats.map((chat) => {
                const otherUser = user.role === "TEACHER" ? chat.student : chat.teacher

                return (
                  <Card
                    key={chat.id}
                    className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <Link href={`/chats/${chat.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-[#c77dff]">
                            <AvatarImage src={`/api/files/retrieve/profile_${otherUser.id}`} />
                            <AvatarFallback className="bg-[#7b2cbf] text-white">
                              {otherUser.firstName[0]}
                              {otherUser.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-[#240046] truncate">
                                {otherUser.firstName} {otherUser.lastName}
                              </h3>
                              <span className="text-sm text-[#5a189a]">{formatDate(chat.lastMessageAt)}</span>
                            </div>

                            <p className="text-sm text-[#3c096c] truncate mb-2">{chat.subject}</p>

                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={otherUser.role === "TEACHER" ? "default" : "secondary"}
                                className={`text-xs ${
                                  otherUser.role === "TEACHER"
                                    ? "bg-[#5a189a] hover:bg-[#7b2cbf]"
                                    : "bg-[#9d4edd] hover:bg-[#c77dff]"
                                }`}
                              >
                                {otherUser.role}
                              </Badge>
                              {chat.active && (
                                <Badge variant="outline" className="text-xs border-[#c77dff] text-[#5a189a]">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg">
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-[#c77dff] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#240046] mb-2">
                  {searchTerm ? "No chats found" : "No conversations yet"}
                </h3>
                <p className="text-[#3c096c] mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : `Start a conversation with your ${user.role === "TEACHER" ? "students" : "teachers"}.`}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
