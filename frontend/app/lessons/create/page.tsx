"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  role: string
  firstName: string
  lastName: string
}

export default function CreateLessonPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    location: "ONLINE",
    startTime: "",
    endTime: "",
    meetingLink: "",
    physicalAddress: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "TEACHER" && parsedUser.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const lessonData = {
        ...formData,
        teacher: { id: user?.id },
      }

      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
        credentials: "include",
      })

      if (response.ok) {
        router.push("/dashboard?tab=lessons&message=Lesson created successfully!")
      } else {
        const errorText = await response.text()
        setError(errorText || "Failed to create lesson")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#c77dff]">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-[#5a189a] hover:bg-[#e0aaff]/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-[#5a189a]" />
            <h1 className="text-xl font-semibold text-[#240046]">Create New Lesson</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-[#c77dff] shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#240046]">Lesson Details</CardTitle>
              <CardDescription className="text-[#3c096c]">Create a new lesson for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#3c096c]">
                    Lesson Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="e.g., Beginner Piano - Scales and Arpeggios"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#3c096c]">
                    Location Type
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="IN_PERSON">In Person</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.location === "ONLINE" || formData.location === "HYBRID" ? (
                  <div className="space-y-2">
                    <Label htmlFor="meetingLink" className="text-[#3c096c]">
                      Meeting Link
                    </Label>
                    <Input
                      id="meetingLink"
                      type="url"
                      placeholder="https://zoom.us/j/123456789"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                    />
                  </div>
                ) : null}

                {formData.location === "IN_PERSON" || formData.location === "HYBRID" ? (
                  <div className="space-y-2">
                    <Label htmlFor="physicalAddress" className="text-[#3c096c]">
                      Physical Address
                    </Label>
                    <Textarea
                      id="physicalAddress"
                      placeholder="Enter the lesson location address"
                      value={formData.physicalAddress}
                      onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                      rows={3}
                      className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                    />
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-[#3c096c]">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-[#3c096c]">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#5a189a] hover:bg-[#7b2cbf] text-white"
                  >
                    {loading ? "Creating..." : "Create Lesson"}
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#5a189a] text-[#5a189a] hover:bg-[#e0aaff]/50"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
