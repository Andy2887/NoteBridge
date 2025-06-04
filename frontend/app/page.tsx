"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("user")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0aaff] via-[#c77dff]/30 to-[#9d4edd]/20">
      {/* Navigation */}
      <nav className="border-b border-[#c77dff] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-[#5a189a]" />
            <span className="text-2xl font-bold text-[#10002b]">NoteBridge</span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-[#3c096c] hover:bg-[#e0aaff]/50">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#10002b] mb-6">
            Connect. Learn. <span className="text-[#5a189a]">Create Music.</span>
          </h1>
          <p className="text-xl text-[#240046] mb-8 max-w-3xl mx-auto">
            NoteBridge is the comprehensive platform for managing music lessons, enabling seamless communication between
            teachers and students, and organizing your musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-[#5a189a] hover:bg-[#7b2cbf] text-white">
                Start Learning Today
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-[#5a189a] text-[#5a189a] hover:bg-[#e0aaff]/50">
                I'm a Teacher
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#10002b] mb-12">
            Everything you need for music education
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-[#5a189a] mb-4" />
                <CardTitle className="text-[#240046]">Lesson Management</CardTitle>
                <CardDescription className="text-[#3c096c]">
                  Schedule, manage, and track your music lessons with ease. Support for both online and in-person
                  sessions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-[#7b2cbf] mb-4" />
                <CardTitle className="text-[#240046]">Real-time Chat</CardTitle>
                <CardDescription className="text-[#3c096c]">
                  Stay connected with your teachers or students through our integrated messaging system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#c77dff] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-[#9d4edd] mb-4" />
                <CardTitle className="text-[#240046]">User Profiles</CardTitle>
                <CardDescription className="text-[#3c096c]">
                  Create detailed profiles with instruments, bio, and track your musical progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#e0aaff]/50 to-[#c77dff]/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#5a189a] mb-2">500+</div>
              <div className="text-[#240046]">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#7b2cbf] mb-2">50+</div>
              <div className="text-[#240046]">Expert Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#9d4edd] mb-2">1000+</div>
              <div className="text-[#240046]">Lessons Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#3c096c] mb-2">15+</div>
              <div className="text-[#240046]">Instruments</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#240046] to-[#5a189a] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to start your musical journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students and teachers already using NoteBridge</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-[#e0aaff] text-[#240046] hover:bg-white">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#10002b] text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6" />
              <span className="text-xl font-bold">NoteBridge</span>
            </div>
            <div className="text-[#c77dff]">© 2025 NoteBridge. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
