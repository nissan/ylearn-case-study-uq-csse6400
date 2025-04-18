"use client"

import Link from "next/link"
import { GraduationCap, BarChart, BookOpen, GraduationCapIcon, Percent, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { ExternalLink, FileText, Github, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg font-semibold">
              y<span className="text-primary">Learn</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to y<span className="text-primary">Learn</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A modern Learning Management System for university settings
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/architecture">
                  <Button size="lg" variant="outline">
                    View Architecture
                    <BarChart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted-foreground/10 px-3 py-1 text-sm">Modern Learning</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Designed for the modern classroom</h2>
                <p className="text-muted-foreground md:text-xl">
                  yLearn provides a comprehensive platform for course management, assessments, and grading, all in a
                  modern, user-friendly interface.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Manage and access course materials, lectures, and resources.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <GraduationCapIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create, submit, and grade assignments, quizzes, and exams.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <Percent className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Grades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Track academic progress and view detailed grade reports.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Architecture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Explore the microservices architecture powering yLearn.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About This Project</h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>
                    This application was developed as part of the CSSE6400 Software Architecture course at The
                    University of Queensland. It implements a modern Learning Management System (LMS) designed as a
                    modular distributed system to replace the aging monolithic Blackboard platform.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <a
                      href="/ylearn-brief.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FileText className="h-6 w-6 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Project Brief</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated: 2025/03/18</div>
                      </div>
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>

                    <a
                      href="/ylearn-writeup.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FileText className="h-6 w-6 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Design Write-Up</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated: 2025/03/14</div>
                      </div>
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Credits</h3>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p>
                            <span className="font-medium text-gray-900 dark:text-white">Original Authors:</span>
                            <br />
                            Brae Webb & Richard Thomas
                            <br />
                            Course: CSSE6400 Software Architecture
                            <br />
                            Institution: The University of Queensland
                          </p>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 overflow-hidden rounded-md border-2 border-gray-200 dark:border-gray-700">
                            <Image
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-11%20at%202.06.44%E2%80%AFam-Yxn6JeTTU7lXkBm144UgLP8sjkaOUr.png"
                              alt="Nissan Dookeran"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Implementation by:</h4>
                            <p className="text-gray-900 dark:text-white font-medium">Nissan Dookeran</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <a
                                href="https://github.com/nissan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 flex items-center"
                              >
                                <Github className="h-4 w-4 mr-1" />
                                <span className="text-sm">GitHub</span>
                              </a>
                              <a
                                href="https://linkedin.com/in/nissandookeran"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                              >
                                <Linkedin className="h-4 w-4 mr-1" />
                                <span className="text-sm">LinkedIn</span>
                              </a>
                              <a
                                href="https://x.com/redditech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                              >
                                <Twitter className="h-4 w-4 mr-1" />
                                <span className="text-sm">Twitter</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 yLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/architecture" className="text-sm text-muted-foreground underline underline-offset-4">
              Architecture
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
