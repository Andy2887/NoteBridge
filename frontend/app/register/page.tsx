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
    <div className="min-h-screen bg-gradient-to-br from-[#fdf0d5] via-white to-[#669bbc] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-[#669bbc] shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-8 w-8 text-[#780000]" />
            <span className="text-2xl font-bold text-gray-900">NoteBridge</span>
          </div>
          <CardTitle className="text-2xl text-[#780000]">Create your account</CardTitle>
          <CardDescription>Join our community of music learners and teachers</CardDescription>
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
                <Label htmlFor="firstName" className="text-[#780000]">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#780000]">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#780000]">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#780000]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#780000]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-[#fdf0d5] text-[#003049]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#780000]">
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrument" className="text-[#780000]">
                  Instrument
                </Label>
                <Select
                  value={formData.instrument}
                  onValueChange={(value) => setFormData({ ...formData, instrument: value })}
                >
                  <SelectTrigger className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]">
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
              <Label htmlFor="phoneNumber" className="text-[#780000]">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[#780000]">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your musical background..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="border-[#669bbc] focus:border-[#003049] focus:ring-[#003049]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#780000] hover:bg-[#c1121f] text-white" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#003049] hover:text-[#780000] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
