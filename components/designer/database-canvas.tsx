"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Database } from "lucide-react"
import { useTheme as useNextTheme } from "next-themes"

interface Table {
  id: string
  name: string
  position: { x: number; y: number }
  columns: any[]
  relations: any[]
}

interface Relation {
  id: string
  fromTableId: string
  fromColumnId: string
  toTableId: string
  toColumnId: string
  type: "one-to-one" | "one-to-many" | "many-to-many"
}

interface Props {
  tables: Table[]
  selectedTable: string | null
  onUpdatePosition: (tableId: string, position: { x: number; y: number }) => void
  onSelectTable: (tableId: string | null) => void
  onAddRelation?: (relation: Relation) => void
  relations?: Relation[]
}

export default function DatabaseCanvas({
  tables,
  selectedTable,
  onUpdatePosition,
  onSelectTable,
  onAddRelation,
  relations = [],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingTable, setDraggingTable] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [drawingRelation, setDrawingRelation] = useState<{ from: string; to?: string } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { theme } = useNextTheme()

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"
    const bgColor = isDark ? "#1a1a1a" : "#ffffff"
    const gridColor = isDark ? "#333333" : "#e5e7eb"
    const dotColor = isDark ? "#444444" : "#d1d5db"

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const dotSpacing = 50
    const dotRadius = 1.5
    ctx.fillStyle = dotColor
    for (let x = 0; x < canvasRef.current.width; x += dotSpacing) {
      for (let y = 0; y < canvasRef.current.height; y += dotSpacing) {
        ctx.beginPath()
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw relationships
    relations.forEach((relation) => {
      const fromTable = tables.find((t) => t.id === relation.fromTableId)
      const toTable = tables.find((t) => t.id === relation.toTableId)

      if (fromTable && toTable) {
        const x1 = fromTable.position.x + 160
        const y1 = fromTable.position.y + 60
        const x2 = toTable.position.x
        const y2 = toTable.position.y + 60

        ctx.strokeStyle = relation.type === "one-to-many" ? "#f59e0b" : "#3b82f6"
        ctx.lineWidth = 2
        ctx.setLineDash(relation.type === "many-to-many" ? [5, 5] : [])
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.setLineDash([])

        const angle = Math.atan2(y2 - y1, x2 - x1)
        const size = 12
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6))
        ctx.closePath()
        ctx.fill()
      }
    })

    // Draw temporary relation line
    if (drawingRelation?.from && !drawingRelation?.to) {
      const fromTable = tables.find((t) => t.id === drawingRelation.from)
      if (fromTable) {
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(fromTable.position.x + 160, fromTable.position.y + 60)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [tables, relations, drawingRelation, mousePos, theme])

  const handleMouseDown = (tableId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    setDraggingTable(tableId)
    setDragOffset({
      x: e.clientX - rect.left - table.position.x,
      y: e.clientY - rect.top - table.position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    onUpdatePosition(draggingTable, { x: Math.max(0, newX), y: Math.max(0, newY) })
  }

  const handleMouseUp = () => {
    setDraggingTable(null)
  }

  useEffect(() => {
    if (draggingTable) {
      document.addEventListener("mousemove", handleMouseMove as any)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggingTable, dragOffset])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
      onMouseMove={(e) => {
        handleMouseMove(e)
        setMousePos({
          x: e.clientX - (containerRef.current?.getBoundingClientRect().left || 0),
          y: e.clientY - (containerRef.current?.getBoundingClientRect().top || 0),
        })
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" width={2000} height={1500} />

      <div className="absolute inset-0">
        {tables.map((table) => (
          <TableNode
            key={table.id}
            table={table}
            isSelected={selectedTable === table.id}
            onMouseDown={(e) => handleMouseDown(table.id, e)}
            onClick={() => onSelectTable(table.id)}
          />
        ))}
      </div>
    </div>
  )
}

function TableNode({
  table,
  isSelected,
  onMouseDown,
  onClick,
}: {
  table: Table
  isSelected: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onClick: () => void
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${table.position.x}px`,
        top: `${table.position.y}px`,
        cursor: "grab",
      }}
      className={`w-40 rounded-lg border-2 transition-all shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-blue-400 hover:shadow-lg"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold p-3 rounded-t text-sm flex items-center gap-2">
        <Database className="w-4 h-4" />
        {table.name}
      </div>
      <div className="p-2 space-y-1">
        {table.columns.map((col) => (
          <div
            key={col.id}
            className={`text-xs p-1.5 rounded transition-colors ${
              col.isPrimary
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-semibold"
                : "bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            <span className="flex items-center gap-1">
              {col.isPrimary && "🔑"}
              <span className="truncate">{col.name}</span>
            </span>
            <span className="text-[10px] text-gray-600 dark:text-gray-400">{col.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
