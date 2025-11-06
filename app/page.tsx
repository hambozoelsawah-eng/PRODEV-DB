import Link from "next/link"
import { Database, Zap, Code, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">DbDesigner</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/docs">
              <Button variant="ghost">Documentation</Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Design Databases Visually
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Intuitive visual interface for creating and managing databases. Design your tables, define
                relationships, and get production-ready MySQL code.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/designer">
                <Button size="lg" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Go to Designer
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  <BookOpen className="w-4 h-4" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 p-8 min-h-[400px] flex items-end justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-lg p-3 space-y-2 hover:border-blue-500/50 transition-colors"
                >
                  <div className="h-2 bg-muted rounded w-1/3" />
                  <div className="h-2 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to design professional databases in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                title: "Table Design",
                desc: "Create tables easily with support for different data types",
              },
              {
                icon: Zap,
                title: "Relationships",
                desc: "Define relationships between tables and visualize connections",
              },
              { icon: Code, title: "MySQL Export", desc: "Get production-ready SQL code instantly" },
              { icon: Code, title: "Code Generator", desc: "Generate connection code in PHP, Python, and Node.js" },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 hover:border-foreground/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Start designing your database now for free</p>
          <Link href="/designer">
            <Button size="lg" className="gap-2">
              <Database className="w-4 h-4" />
              Open Designer
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span className="font-semibold">DbDesigner</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
