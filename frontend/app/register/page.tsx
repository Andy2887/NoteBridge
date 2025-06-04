"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "STUDENT",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    instrument: "",
    bio: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const instruments = [
    "Piano",
    "Guitar",
    "Violin",
    "Drums",
    "Saxophone",
    "Flute",
    "Trumpet",
    "Cello",
    "Bass",
    "Clarinet",
    "Voice",
    "Ukulele",
    "Keyboard",
    "Harp",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/login?message=Registration successful! Please log in.")
      } else {
        const errorText = await response.text()
        setError(errorText || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-[#c77dff] shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-8 w-8 text-[#5a189a]" />
            <span className="text-2xl font-bold text-[#10002b]">NoteBridge</span>
          </div>
          <CardTitle className="text-2xl text-[#240046]">Create your account</CardTitle>
          <CardDescription className="text-[#3c096c]">
            Join our community of music learners and teachers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#3c096c]">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#3c096c]">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#3c096c]">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#3c096c]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#3c096c]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-[#e0aaff]/50 text-[#5a189a]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#3c096c]">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrument" className="text-[#3c096c]">
                  Instrument
                </Label>
                <Select
                  value={formData.instrument}
                  onValueChange={(value) => setFormData({ ...formData, instrument: value })}
                >
                  <SelectTrigger className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]">
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {instruments.map((instrument) => (
                      <SelectItem key={instrument} value={instrument}>
                        {instrument}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-[#3c096c]">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[#3c096c]">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your musical background..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="border-[#c77dff] focus:border-[#7b2cbf] focus:ring-[#7b2cbf]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#5a189a] hover:bg-[#7b2cbf] text-white" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#3c096c]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7b2cbf] hover:text-[#5a189a] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
