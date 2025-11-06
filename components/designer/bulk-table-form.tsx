"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TableInput {
  id: string
  name: string
}

interface Props {
  onSubmit: (tableNames: string[]) => void
}

export default function BulkTableForm({ onSubmit }: Props) {
  const [tables, setTables] = useState<TableInput[]>([
    { id: "1", name: "" },
    { id: "2", name: "" },
  ])

  const handleAddInput = () => {
    setTables([...tables, { id: Date.now().toString(), name: "" }])
  }

  const handleRemoveInput = (id: string) => {
    if (tables.length > 1) {
      setTables(tables.filter((t) => t.id !== id))
    }
  }

  const handleNameChange = (id: string, value: string) => {
    setTables(tables.map((t) => (t.id === id ? { ...t, name: value } : t)))
  }

  const handleSubmit = () => {
    const validNames = tables.map((t) => t.name.trim()).filter((name) => name.length > 0)

    if (validNames.length > 0) {
      onSubmit(validNames)
    }
  }

  const validTableNames = tables.filter((t) => t.name.trim().length > 0)

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tables.map((table) => (
          <div key={table.id} className="flex gap-2 items-center">
            <Input
              placeholder="e.g., users, products, orders"
              value={table.name}
              onChange={(e) => handleNameChange(table.id, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
              className="flex-1"
            />
            {tables.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveInput(table.id)}
                className="bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleAddInput}>
        <Plus className="w-4 h-4" />
        Add More Tables
      </Button>

      <Button onClick={handleSubmit} disabled={validTableNames.length === 0} className="w-full">
        Create {validTableNames.length} Table{validTableNames.length !== 1 ? "s" : ""}
      </Button>
    </div>
  )
}
