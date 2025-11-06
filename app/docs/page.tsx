import Link from "next/link"
import { Book, ChevronRight, Database, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">DbDesigner</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/designer">
              <Button>Open Designer</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-muted-foreground text-lg">Complete guide to using DbDesigner</p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-500" />
              Quick Start
            </h2>
            <div className="space-y-4 text-foreground">
              <div>
                <h3 className="font-semibold mb-2">1. Create a New Table</h3>
                <p className="text-muted-foreground">
                  From the left panel, click "Add Table" and enter the table name (e.g., users, products).
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Add Columns</h3>
                <p className="text-muted-foreground">
                  After creating a table, use the right panel to add columns. Specify the column name, data type, and
                  properties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Arrange Tables</h3>
                <p className="text-muted-foreground">
                  You can drag and drop tables on the canvas to organize your design layout.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Export Code</h3>
                <p className="text-muted-foreground">
                  Click "MySQL" to get production-ready SQL code or "Generator" to create connection code.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-500" />
              Features
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">Intuitive Visual Interface</h3>
                  <p className="text-sm text-muted-foreground">Easy and fast design for tables and relationships</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Drag & Drop System</h3>
                  <p className="text-sm text-muted-foreground">Move tables easily on the canvas</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">MySQL Export</h3>
                  <p className="text-sm text-muted-foreground">Get production-ready SQL code instantly</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold">Code Generator</h3>
                  <p className="text-sm text-muted-foreground">Generate connection code for Node.js, Python, and PHP</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Helpful Tips</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Use descriptive names for tables and columns</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Set Primary Keys correctly for each table</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Use appropriate data types for each column</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Organize your tables logically on the canvas</span>
              </li>
            </ul>
          </section>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-4">
              Open the designer and start creating professional databases now
            </p>
            <Link href="/designer">
              <Button size="lg">Open Designer</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
