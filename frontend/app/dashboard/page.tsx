"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MessageCircle, Users, BookOpen, Plus, Clock, MapPin, Video, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: string
  firstName: string
  lastName: string
  phoneNumber: string
  instrument: string
  bio: string
}

interface Lesson {
  id: number
  teacher: User
  description: string
  location: string
  startTime: string
  endTime: string
  meetingLink?: string
  physicalAddress?: string
  cancelled: boolean
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
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
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [lessonsRes, chatsRes, unreadRes] = await Promise.all([
        fetch("/api/lessons", { credentials: "include" }),
        fetch("/api/chats", { credentials: "include" }),
        fetch("/api/chats/unread-count", { credentials: "include" }),
      ])

      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json()
        setLessons(lessonsData)
      }

      if (chatsRes.ok) {
        const chatsData = await chatsRes.json()
        setChats(chatsData)
      }

      if (unreadRes.ok) {
        const unreadData = await unreadRes.json()
        setUnreadCount(unreadData.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const upcomingLessons = lessons
    .filter((lesson) => new Date(lesson.startTime) > new Date() && !lesson.cancelled)
    .slice(0, 3)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a189a] mx-auto mb-4"></div>
          <p className="text-[#3c096c]">Loading dashboard...</p>
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
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-[#5a189a]" />
              <span className="text-2xl font-bold text-[#10002b]">NoteBridge</span>
            </Link>
            <Badge
              variant={user.role === "TEACHER" ? "default" : "secondary"}
              className={
                user.role === "TEACHER" ? "bg-[#5a189a] hover:bg-[#7b2cbf]" : "bg-[#9d4edd] hover:bg-[#c77dff]"
              }
            >
              {user.role}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="ring-2 ring-[#c77dff]">
                <AvatarImage src={`/api/files/retrieve/profile_${user.id}`} />
                <AvatarFallback className="bg-[#3c096c] text-white">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium text-[#240046]">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-[#5a189a]">{user.instrument}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#5a189a] hover:bg-[#e0aaff]/50">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#240046] mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-[#3c096c]">Here's what's happening with your music lessons today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[#5a189a]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#3c096c]">Upcoming Lessons</p>
                  <p className="text-2xl font-bold text-[#240046]">{upcomingLessons.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-[#7b2cbf]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#3c096c]">Unread Messages</p>
                  <p className="text-2xl font-bold text-[#240046]">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#9d4edd]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#3c096c]">Active Chats</p>
                  <p className="text-2xl font-bold text-[#240046]">{chats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-[#c77dff]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#3c096c]">Total Lessons</p>
                  <p className="text-2xl font-bold text-[#240046]">{lessons.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-[#c77dff]">
            <TabsTrigger
              value="lessons"
              className="data-[state=active]:bg-[#5a189a] data-[state=active]:text-white text-[#3c096c]"
            >
              Lessons
            </TabsTrigger>
            <TabsTrigger
              value="chats"
              className="data-[state=active]:bg-[#5a189a] data-[state=active]:text-white text-[#3c096c]"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#5a189a] data-[state=active]:text-white text-[#3c096c]"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#240046]">Your Lessons</h2>
              {user.role === "TEACHER" && (
                <Link href="/lessons/create">
                  <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Lesson
                  </Button>
                </Link>
              )}
            </div>

            {upcomingLessons.length > 0 ? (
              <div className="grid gap-4">
                {upcomingLessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-[#240046]">{lesson.description}</h3>
                          <div className="flex items-center space-x-4 text-sm text-[#3c096c] mb-2">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(lesson.startTime)}
                            </div>
                            <div className="flex items-center">
                              {lesson.location === "ONLINE" ? (
                                <>
                                  <Video className="h-4 w-4 mr-1" />
                                  Online
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 mr-1" />
                                  In Person
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-[#3c096c]">
                            with {lesson.teacher.firstName} {lesson.teacher.lastName}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {lesson.location === "ONLINE" && lesson.meetingLink && (
                            <Button size="sm" className="bg-[#9d4edd] hover:bg-[#7b2cbf] text-white" asChild>
                              <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer">
                                Join
                              </a>
                            </Button>
                          )}
                          <Link href={`/lessons/${lesson.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#5a189a] text-[#5a189a] hover:bg-[#e0aaff]/50"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-[#c77dff] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#240046] mb-2">No upcoming lessons</h3>
                  <p className="text-[#3c096c] mb-4">
                    {user.role === "TEACHER"
                      ? "Create your first lesson to get started."
                      : "Contact a teacher to schedule your first lesson."}
                  </p>
                  {user.role === "TEACHER" && (
                    <Link href="/lessons/create">
                      <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">Create Lesson</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#240046]">Messages</h2>
              <Link href="/chats">
                <Button variant="outline" className="border-[#5a189a] text-[#5a189a] hover:bg-[#e0aaff]/50">
                  View All Chats
                </Button>
              </Link>
            </div>

            {chats.length > 0 ? (
              <div className="grid gap-4">
                {chats.slice(0, 5).map((chat) => (
                  <Card
                    key={chat.id}
                    className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="ring-2 ring-[#c77dff]">
                            <AvatarFallback className="bg-[#7b2cbf] text-white">
                              {user.role === "TEACHER"
                                ? `${chat.student.firstName[0]}${chat.student.lastName[0]}`
                                : `${chat.teacher.firstName[0]}${chat.teacher.lastName[0]}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#240046]">
                              {user.role === "TEACHER"
                                ? `${chat.student.firstName} ${chat.student.lastName}`
                                : `${chat.teacher.firstName} ${chat.teacher.lastName}`}
                            </p>
                            <p className="text-sm text-[#3c096c]">{chat.subject}</p>
                          </div>
                        </div>
                        <Link href={`/chats/${chat.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#5a189a] text-[#5a189a] hover:bg-[#e0aaff]/50"
                          >
                            Open
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg">
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-[#c77dff] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#240046] mb-2">No messages yet</h3>
                  <p className="text-[#3c096c]">
                    Start a conversation with your {user.role === "TEACHER" ? "students" : "teachers"}.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-[#c77dff] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#240046]">Profile Information</CardTitle>
                <CardDescription className="text-[#3c096c]">Your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 ring-4 ring-[#c77dff]">
                    <AvatarImage src={`/api/files/retrieve/profile_${user.id}`} />
                    <AvatarFallback className="text-lg bg-[#3c096c] text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-[#240046]">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-[#3c096c]">@{user.username}</p>
                    <Badge
                      variant={user.role === "TEACHER" ? "default" : "secondary"}
                      className={
                        user.role === "TEACHER" ? "bg-[#5a189a] hover:bg-[#7b2cbf]" : "bg-[#9d4edd] hover:bg-[#c77dff]"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-[#3c096c]">Email</Label>
                    <p className="text-sm text-[#5a189a]">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#3c096c]">Phone</Label>
                    <p className="text-sm text-[#5a189a]">{user.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#3c096c]">Instrument</Label>
                    <p className="text-sm text-[#5a189a]">{user.instrument || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#3c096c]">Role</Label>
                    <p className="text-sm text-[#5a189a]">{user.role}</p>
                  </div>
                </div>

                {user.bio && (
                  <div>
                    <Label className="text-sm font-medium text-[#3c096c]">Bio</Label>
                    <p className="text-sm mt-1 text-[#5a189a]">{user.bio}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Link href="/profile/edit">
                    <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
