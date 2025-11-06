"use client"
import { Database, Plus } from "lucide-react"

interface Template {
  name: string
  description: string
  tables: any[]
  relations: any[]
}

export const DATABASE_TEMPLATES: Record<string, Template> = {
  "user-product": {
    name: "User & Product",
    description: "E-commerce schema with users and products",
    tables: [
      {
        id: "1",
        name: "users",
        position: { x: 100, y: 100 },
        columns: [
          { id: "1-1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true },
          { id: "1-2", name: "email", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "1-3", name: "username", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "1-4", name: "password", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "1-5", name: "created_at", type: "DATETIME", isPrimary: false, isNull: false, isAutoIncrement: false },
        ],
        relations: [],
      },
      {
        id: "2",
        name: "products",
        position: { x: 500, y: 100 },
        columns: [
          { id: "2-1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true },
          { id: "2-2", name: "name", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "2-3", name: "description", type: "TEXT", isPrimary: false, isNull: true, isAutoIncrement: false },
          { id: "2-4", name: "price", type: "DECIMAL", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "2-5", name: "user_id", type: "INT", isPrimary: false, isNull: false, isAutoIncrement: false },
        ],
        relations: [],
      },
    ],
    relations: [
      {
        id: "rel-1",
        fromTableId: "2",
        fromColumnId: "2-5",
        toTableId: "1",
        toColumnId: "1-1",
        type: "one-to-many",
      },
    ],
  },
  blog: {
    name: "Blog Platform",
    description: "Schema for a blogging system",
    tables: [
      {
        id: "1",
        name: "authors",
        position: { x: 100, y: 100 },
        columns: [
          { id: "1-1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true },
          { id: "1-2", name: "name", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "1-3", name: "email", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "1-4", name: "bio", type: "TEXT", isPrimary: false, isNull: true, isAutoIncrement: false },
        ],
        relations: [],
      },
      {
        id: "2",
        name: "posts",
        position: { x: 500, y: 100 },
        columns: [
          { id: "2-1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true },
          { id: "2-2", name: "title", type: "VARCHAR", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "2-3", name: "content", type: "LONGTEXT", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "2-4", name: "author_id", type: "INT", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "2-5", name: "created_at", type: "DATETIME", isPrimary: false, isNull: false, isAutoIncrement: false },
        ],
        relations: [],
      },
      {
        id: "3",
        name: "comments",
        position: { x: 900, y: 100 },
        columns: [
          { id: "3-1", name: "id", type: "INT", isPrimary: true, isNull: false, isAutoIncrement: true },
          { id: "3-2", name: "content", type: "TEXT", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "3-3", name: "post_id", type: "INT", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "3-4", name: "author_id", type: "INT", isPrimary: false, isNull: false, isAutoIncrement: false },
          { id: "3-5", name: "created_at", type: "DATETIME", isPrimary: false, isNull: false, isAutoIncrement: false },
        ],
        relations: [],
      },
    ],
    relations: [
      {
        id: "rel-1",
        fromTableId: "2",
        fromColumnId: "2-4",
        toTableId: "1",
        toColumnId: "1-1",
        type: "one-to-many",
      },
      {
        id: "rel-2",
        fromTableId: "3",
        fromColumnId: "3-3",
        toTableId: "2",
        toColumnId: "2-1",
        type: "one-to-many",
      },
      {
        id: "rel-3",
        fromTableId: "3",
        fromColumnId: "3-4",
        toTableId: "1",
        toColumnId: "1-1",
        type: "one-to-many",
      },
    ],
  },
}

interface TemplatePickerProps {
  onSelectTemplate: (template: Template) => void
}

export function TemplatePicker({ onSelectTemplate }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.values(DATABASE_TEMPLATES).map((template) => (
        <button
          key={template.name}
          onClick={() => onSelectTemplate(template)}
          className="p-4 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-left group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {template.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground text-left mb-3">{template.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Plus className="w-3 h-3" />
            {template.tables.length} tables, {template.relations.length} relations
          </div>
        </button>
      ))}
    </div>
  )
}
