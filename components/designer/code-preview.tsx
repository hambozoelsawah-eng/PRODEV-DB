"use client"

interface Props {
  tables: any[]
  relations: any[]
}

export default function CodePreview({ tables, relations }: Props) {
  return (
    <div className="p-8">
      <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm max-h-[600px] overflow-auto">
        <div className="space-y-3">
          {tables.map((table) => (
            <div key={table.id} className="mb-4 pb-4 border-b border-border">
              <div className="text-green-600 dark:text-green-400 font-bold">{`CREATE TABLE ${table.name} (`}</div>
              {table.columns.map((col: any, idx: number) => {
                let def = `${col.name} ${col.type}`
                if (col.isPrimary) def += " PRIMARY KEY"
                if (col.isAutoIncrement) def += " AUTO_INCREMENT"
                if (!col.isNull) def += " NOT NULL"
                return (
                  <div key={col.id} className="ml-4 text-gray-700 dark:text-gray-300">
                    {def}
                    {idx !== table.columns.length - 1 && ","}
                  </div>
                )
              })}

              {relations
                .filter((r) => r.fromTableId === table.id)
                .map((rel: any, idx: number) => {
                  const toTable = tables.find((t) => t.id === rel.toTableId)
                  return (
                    <div key={rel.id} className="ml-4 text-blue-700 dark:text-blue-400">
                      FOREIGN KEY ({rel.fromColumnId}) REFERENCES {toTable?.name}({rel.toColumnId})
                      {idx !== relations.length - 1 && ","}
                    </div>
                  )
                })}

              <div className="text-green-600 dark:text-green-400 font-bold">{`);`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
