"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const COLUMN_TYPES = [
  "INT",
  "VARCHAR",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "DATETIME",
  "DECIMAL",
  "FLOAT",
  "BIGINT",
  "SMALLINT",
  "LONGTEXT",
  "JSON",
]

interface Props {
  table: any
  tables: any[]
  relations: any[]
  onAddColumn: (tableId: string, column: any) => void
  onDeleteColumn: (tableId: string, columnId: string) => void
  onUpdateTable: (tableId: string, updates: any) => void
  onAddRelation?: (relation: any) => void
  onDeleteRelation?: (relationId: string) => void
}

export default function TablePanel({
  table,
  tables,
  relations,
  onAddColumn,
  onDeleteColumn,
  onUpdateTable,
  onAddRelation,
  onDeleteRelation,
}: Props) {
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(table.name)

  const tableRelations = relations.filter((r) => r.fromTableId === table.id || r.toTableId === table.id)

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div>
        <h3 className="font-semibold text-sm mb-2">Table Info</h3>
        <div className="flex gap-2">
          {editingName ? (
            <div className="flex gap-1 flex-1">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="text-sm" />
              <Button
                size="sm"
                onClick={() => {
                  onUpdateTable(table.id, { name: newName })
                  setEditingName(false)
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent"
              onClick={() => setEditingName(true)}
            >
              {table.name}
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Columns</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                <Plus className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Column</DialogTitle>
              </DialogHeader>
              <AddColumnForm onSubmit={(col) => onAddColumn(table.id, col)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {table.columns.map((col: any) => (
            <div
              key={col.id}
              className="p-2 bg-muted rounded-lg text-xs space-y-1 border border-border hover:border-foreground/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <div className={col.isPrimary ? "font-bold text-blue-600 dark:text-blue-400" : "font-medium"}>
                    {col.name}
                  </div>
                  <div className="text-muted-foreground text-[10px]">{col.type}</div>
                </div>
                <button
                  onClick={() => onDeleteColumn(table.id, col.id)}
                  className="p-1 hover:bg-destructive/10 rounded flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              </div>
              <div className="flex gap-1 flex-wrap text-[10px]">
                {col.isPrimary && (
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 rounded">PK</span>
                )}
                {col.isAutoIncrement && (
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 rounded">AUTO</span>
                )}
                {col.isNull === false && (
                  <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-1.5 rounded">NN</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {onAddRelation && tables.length > 1 && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Relationships</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <Link2 className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Relationship</DialogTitle>
                </DialogHeader>
                <AddRelationForm
                  currentTable={table}
                  tables={tables}
                  onSubmit={(relation) => {
                    onAddRelation(relation)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {tableRelations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No relationships yet</p>
          ) : (
            <div className="space-y-2">
              {tableRelations.map((relation: any) => {
                const fromTable = tables.find((t) => t.id === relation.fromTableId)
                const toTable = tables.find((t) => t.id === relation.toTableId)
                return (
                  <div
                    key={relation.id}
                    className="p-2 bg-muted rounded text-xs border border-border hover:border-foreground/50 group flex items-start justify-between gap-1"
                  >
                    <span className="flex-1 truncate">
                      <span className="font-medium">{fromTable?.name}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="font-medium">{toTable?.name}</span>
                      <span className="text-muted-foreground text-[10px] block mt-0.5">
                        {relation.type === "one-to-one" && "1:1"}
                        {relation.type === "one-to-many" && "1:N"}
                        {relation.type === "many-to-many" && "N:N"}
                      </span>
                    </span>
                    {onDeleteRelation && (
                      <button
                        onClick={() => onDeleteRelation(relation.id)}
                        className="p-1 hover:bg-destructive/10 rounded flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AddColumnForm({ onSubmit }: { onSubmit: (col: any) => void }) {
  const [name, setName] = useState("")
  const [type, setType] = useState("VARCHAR")
  const [isPrimary, setIsPrimary] = useState(false)
  const [isAutoIncrement, setIsAutoIncrement] = useState(false)
  const [isNull, setIsNull] = useState(true)

  return (
    <div className="space-y-4">
      <Input placeholder="Column name" value={name} onChange={(e) => setName(e.target.value)} />
      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COLUMN_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => {
              setIsPrimary(e.target.checked)
              if (e.target.checked && type === "VARCHAR") setType("INT")
            }}
            className="rounded w-4 h-4"
          />
          Primary Key
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAutoIncrement}
            onChange={(e) => setIsAutoIncrement(e.target.checked)}
            disabled={!isPrimary}
            className="rounded w-4 h-4"
          />
          Auto Increment
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNull}
            onChange={(e) => setIsNull(e.target.checked)}
            className="rounded w-4 h-4"
          />
          Nullable
        </label>
      </div>

      <Button
        onClick={() => {
          if (name.trim()) {
            onSubmit({ name, type, isPrimary, isAutoIncrement, isNull })
            setName("")
            setType("VARCHAR")
            setIsPrimary(false)
            setIsAutoIncrement(false)
            setIsNull(true)
          }
        }}
        disabled={!name.trim()}
        className="w-full"
      >
        Add Column
      </Button>
    </div>
  )
}

function AddRelationForm({
  currentTable,
  tables,
  onSubmit,
}: {
  currentTable: any
  tables: any[]
  onSubmit: (relation: any) => void
}) {
  const [toTableId, setToTableId] = useState("")
  const [fromColumnId, setFromColumnId] = useState("")
  const [toColumnId, setToColumnId] = useState("")
  const [relationType, setRelationType] = useState<"one-to-one" | "one-to-many" | "many-to-many">("one-to-many")

  const toTable = tables.find((t) => t.id === toTableId)

  return (
    <div className="space-y-4">
      <Select value={toTableId} onValueChange={setToTableId}>
        <SelectTrigger>
          <SelectValue placeholder="Select related table" />
        </SelectTrigger>
        <SelectContent>
          {tables
            .filter((t) => t.id !== currentTable.id)
            .map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select value={fromColumnId} onValueChange={setFromColumnId}>
        <SelectTrigger>
          <SelectValue placeholder="Column from this table" />
        </SelectTrigger>
        <SelectContent>
          {currentTable.columns.map((col: any) => (
            <SelectItem key={col.id} value={col.id}>
              {col.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {toTable && (
        <Select value={toColumnId} onValueChange={setToColumnId}>
          <SelectTrigger>
            <SelectValue placeholder={`Column from ${toTable.name}`} />
          </SelectTrigger>
          <SelectContent>
            {toTable.columns.map((col: any) => (
              <SelectItem key={col.id} value={col.id}>
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={relationType} onValueChange={(v: any) => setRelationType(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one-to-one">One to One (1:1)</SelectItem>
          <SelectItem value="one-to-many">One to Many (1:N)</SelectItem>
          <SelectItem value="many-to-many">Many to Many (N:N)</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => {
          if (toTableId && fromColumnId && toColumnId) {
            onSubmit({
              fromTableId: currentTable.id,
              fromColumnId,
              toTableId,
              toColumnId,
              type: relationType,
            })
          }
        }}
        disabled={!toTableId || !fromColumnId || !toColumnId}
        className="w-full"
      >
        Create Relationship
      </Button>
    </div>
  )
}
