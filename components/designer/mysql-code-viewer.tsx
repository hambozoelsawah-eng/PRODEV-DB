"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface Props {
  tables: any[]
  relations: any[]
}

export default function MySQLCodeViewer({ tables, relations }: Props) {
  const generateMySQL = () => {
    let sql = ""

    tables.forEach((table) => {
      const columns = table.columns
        .map((col: any) => {
          let def = `${col.name} ${col.type}`
          if (col.isPrimary) def += " PRIMARY KEY"
          if (col.isAutoIncrement) def += " AUTO_INCREMENT"
          if (!col.isNull) def += " NOT NULL"
          return def
        })
        .join(",\n  ")

      const foreignKeys = relations
        .filter((r) => r.fromTableId === table.id)
        .map((r) => {
          const toTable = tables.find((t) => t.id === r.toTableId)
          return `FOREIGN KEY (${r.fromColumnId}) REFERENCES ${toTable?.name}(${r.toColumnId})`
        })
        .join(",\n  ")

      sql += `CREATE TABLE ${table.name} (\n  ${columns}${foreignKeys ? ",\n  " + foreignKeys : ""}\n);\n\n`
    })

    return sql
  }

  const code = generateMySQL()

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-words max-h-[400px] overflow-auto border border-border">
        {code}
      </div>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(code)
        }}
        className="w-full gap-2"
      >
        <Copy className="w-4 h-4" />
        Copy Code
      </Button>
    </div>
  )
}
