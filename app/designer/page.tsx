"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import BulkTableForm from "@/components/designer/bulk-table-form" // Import the new bulk table form component

import { useState, useCallback } from "react"
import Link from "next/link"
import { Database, Plus, Download, Code, Trash2, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DatabaseCanvas from "@/components/designer/database-canvas"
import TablePanel from "@/components/designer/table-panel"
import CodeGenerator from "@/components/designer/code-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { TemplatePicker } from "@/components/designer/templates"
import CodePreview from "@/components/designer/code-preview" // Import CodePreview component
import MySQLCodeViewer from "@/components/designer/mysql-code-viewer" // Import MySQLCodeViewer component

export default function DesignerPage() {
  const [tables, setTables] = useState<any[]>([])
  const [relations, setRelations] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [showRelationModal, setShowRelationModal] = useState(false)
  const [canvasView, setCanvasView] = useState(true)
  const [showTemplates, setShowTemplates] = useState(tables.length === 0) // Show templates when no tables exist

  const addTable = useCallback((tableName: string) => {
    if (tableName.trim()) {
      const newTable = {
        id: Date.now().toString(),
        name: tableName,
        position: { x: Math.random() * 500 + 100, y: Math.random() * 400 + 100 },
        columns: [{ id: "1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true }],
        relations: [],
      }
      setTables([...tables, newTable])
      setSelectedTable(newTable.id)
    }
  }, [])

  const addMultipleTables = useCallback(
    (tableNames: string[]) => {
      const newTables = tableNames.map((name) => ({
        id: Date.now().toString() + Math.random(),
        name: name.trim(),
        position: { x: Math.random() * 500 + 100, y: Math.random() * 400 + 100 },
        columns: [{ id: "1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true }],
        relations: [],
      }))
      setTables([...tables, ...newTables])
      if (newTables.length > 0) {
        setSelectedTable(newTables[0].id)
      }
    },
    [tables],
  )

  const updateTable = useCallback(
    (tableId: string, updates: any) => {
      setTables(tables.map((t) => (t.id === tableId ? { ...t, ...updates } : t)))
    },
    [tables],
  )

  const deleteTable = useCallback(
    (tableId: string) => {
      setTables(tables.filter((t) => t.id !== tableId))
      setRelations(relations.filter((r) => r.fromTableId !== tableId && r.toTableId !== tableId))
      if (selectedTable === tableId) {
        setSelectedTable(null)
      }
    },
    [tables, selectedTable, relations],
  )

  const addColumn = useCallback(
    (tableId: string, column: any) => {
      setTables(
        tables.map((t) =>
          t.id === tableId ? { ...t, columns: [...t.columns, { ...column, id: Date.now().toString() }] } : t,
        ),
      )
    },
    [tables],
  )

  const deleteColumn = useCallback(
    (tableId: string, columnId: string) => {
      setTables(
        tables.map((t) => (t.id === tableId ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) } : t)),
      )
    },
    [tables],
  )

  const updateTablePosition = useCallback(
    (tableId: string, position: { x: number; y: number }) => {
      setTables(tables.map((t) => (t.id === tableId ? { ...t, position } : t)))
    },
    [tables],
  )

  const addRelation = useCallback(
    (relation: any) => {
      setRelations([...relations, { ...relation, id: Date.now().toString() }])
    },
    [relations],
  )

  const deleteRelation = useCallback(
    (relationId: string) => {
      setRelations(relations.filter((r) => r.id !== relationId))
    },
    [relations],
  )

  const exportAsJSON = () => {
    const data = { tables, relations }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "database-design.json"
    a.click()
  }

  // Function to load template
  const loadTemplate = useCallback((template: any) => {
    setTables(template.tables)
    setRelations(template.relations)
    setShowTemplates(false)
    if (template.tables.length > 0) {
      setSelectedTable(template.tables[0].id)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">DbDesigner</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant={canvasView ? "default" : "outline"}
              size="sm"
              onClick={() => setCanvasView(true)}
              className="gap-1"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Canvas</span>
            </Button>
            <Button
              variant={!canvasView ? "default" : "outline"}
              size="sm"
              onClick={() => setCanvasView(false)}
              className="gap-1"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Code</span>
            </Button>

            {tables.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowCodeModal(true)} className="gap-1">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">MySQL</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowGenerator(true)} className="gap-1">
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Generator</span>
                </Button>
                <Button variant="outline" size="sm" onClick={exportAsJSON} className="gap-1 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">JSON</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {tables.length === 0 && (
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Quick Start - Select a Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <TemplatePicker onSelectTemplate={loadTemplate} />
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowTemplates(false)}>
                Start From Scratch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Tables List */}
        <div className="w-64 border-r border-border bg-muted/30 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Tables</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Table
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                  </DialogHeader>
                  <BulkTableForm
                    onSubmit={(tableNames) => {
                      addMultipleTables(tableNames)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-1">
              {tables.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No tables yet</p>
              ) : (
                tables.map((table) => (
                  <div
                    key={table.id}
                    className={`p-2 rounded-lg cursor-pointer transition-colors border ${
                      selectedTable === table.id
                        ? "bg-blue-500/10 border-blue-500 text-blue-600"
                        : "border-border hover:bg-muted"
                    }`}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{table.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTable(table.id)
                        }}
                        className="p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{table.columns.length} columns</div>
                  </div>
                ))
              )}
            </div>

            {relations.length > 0 && (
              <>
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-sm mb-2">Relationships</h3>
                  <div className="space-y-1">
                    {relations.map((relation) => {
                      const fromTable = tables.find((t) => t.id === relation.fromTableId)
                      const toTable = tables.find((t) => t.id === relation.toTableId)
                      return (
                        <div
                          key={relation.id}
                          className="text-xs p-2 bg-muted rounded hover:bg-muted/80 flex items-center justify-between group"
                        >
                          <span className="truncate">
                            {fromTable?.name} → {toTable?.name}
                          </span>
                          <button
                            onClick={() => deleteRelation(relation.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Canvas/View */}
        <div className="flex-1 overflow-auto bg-background min-h-screen bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] [background-size:20px_20px]">
          {canvasView ? (
            <DatabaseCanvas
              tables={tables}
              selectedTable={selectedTable}
              onUpdatePosition={updateTablePosition}
              onSelectTable={setSelectedTable}
              relations={relations}
              onAddRelation={addRelation}
            />
          ) : (
            <CodePreview tables={tables} relations={relations} />
          )}
        </div>

        {/* Right Sidebar - Table Panel */}
        {selectedTable && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <TablePanel
              table={tables.find((t) => t.id === selectedTable)}
              tables={tables}
              relations={relations}
              onAddColumn={addColumn}
              onDeleteColumn={deleteColumn}
              onUpdateTable={updateTable}
              onAddRelation={addRelation}
              onDeleteRelation={deleteRelation}
            />
          </div>
        )}
      </div>

      {/* MySQL Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>MySQL Code</DialogTitle>
          </DialogHeader>
          <MySQLCodeViewer tables={tables} relations={relations} />
        </DialogContent>
      </Dialog>

      {/* Code Generator Modal */}
      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Code Generator</DialogTitle>
          </DialogHeader>
          <CodeGenerator tables={tables} relations={relations} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddTableForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("")

  return (
    <div className="space-y-4">
      <Input
        placeholder="Table name (e.g., users)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && name.trim()) {
            onSubmit(name)
            setName("")
          }
        }}
      />
      <Button
        onClick={() => {
          onSubmit(name)
          setName("")
        }}
        disabled={!name.trim()}
        className="w-full"
      >
        Create Table
      </Button>
    </div>
  )
}
