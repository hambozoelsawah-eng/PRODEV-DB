"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy } from "lucide-react"

interface Props {
  tables: any[]
  relations?: any[]
}

export default function CodeGenerator({ tables, relations = [] }: Props) {
  const [language, setLanguage] = useState("nodejs")

  const generatePHP = () => {
    return `<?php
// Database Connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create Tables
$sql_statements = [
${tables
  .map((table) => {
    const columns = table.columns
      .map((col: any) => {
        let def = `${col.name} ${col.type}`
        if (col.isPrimary) def += " PRIMARY KEY"
        if (col.isAutoIncrement) def += " AUTO_INCREMENT"
        if (!col.isNull) def += " NOT NULL"
        return def
      })
      .join(", ")

    const foreignKeys = relations
      .filter((r: any) => r.fromTableId === table.id)
      .map((r: any) => {
        const toTable = tables.find((t: any) => t.id === r.toTableId)
        return `FOREIGN KEY (${r.fromColumnId}) REFERENCES ${toTable?.name}(${r.toColumnId})`
      })
      .join(", ")

    return `    "CREATE TABLE IF NOT EXISTS ${table.name} (${columns}${foreignKeys ? ", " + foreignKeys : ""})"`
  })
  .join(",\n")}
];

foreach ($sql_statements as $sql) {
    if ($conn->query($sql) === TRUE) {
        echo "Table created successfully<br>";
    } else {
        echo "Error: " . $conn->error . "<br>";
    }
}

$conn->close();
?>`
  }

  const generatePython = () => {
    return `import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='your_database'
        )
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def create_tables():
    connection = create_connection()
    if not connection:
        return

    cursor = connection.cursor()
    
${tables
  .map((table) => {
    const columns = table.columns
      .map((col: any) => {
        let def = col.name + " " + col.type
        if (col.isPrimary) def += " PRIMARY KEY"
        if (col.isAutoIncrement) def += " AUTO_INCREMENT"
        if (!col.isNull) def += " NOT NULL"
        return def
      })
      .join(",\n        ")

    const foreignKeys = relations
      .filter((r: any) => r.fromTableId === table.id)
      .map((r: any) => {
        const toTable = tables.find((t: any) => t.id === r.toTableId)
        return `FOREIGN KEY (${r.fromColumnId}) REFERENCES ${toTable?.name}(${r.toColumnId})`
      })
      .join(",\n        ")

    return `    sql_${table.name} = """
    CREATE TABLE IF NOT EXISTS ${table.name} (
        ${columns}${foreignKeys ? ",\n        " + foreignKeys : ""}
    )
    """
    try:
        cursor.execute(sql_${table.name})
        connection.commit()
        print("${table.name} table created")
    except Error as e:
        print(f"Error: {e}")`
  })
  .join("\n\n")}

    cursor.close()
    connection.close()

if __name__ == "__main__":
    create_tables()`
  }

  const generateNodeJS = () => {
    return `const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createTables() {
  const connection = await pool.getConnection();
  
  try {
${tables
  .map((table) => {
    const columns = table.columns
      .map((col: any) => {
        let def = `${col.name} ${col.type}`
        if (col.isPrimary) def += " PRIMARY KEY"
        if (col.isAutoIncrement) def += " AUTO_INCREMENT"
        if (!col.isNull) def += " NOT NULL"
        return def
      })
      .join(",\n      ")

    const foreignKeys = relations
      .filter((r: any) => r.fromTableId === table.id)
      .map((r: any) => {
        const toTable = tables.find((t: any) => t.id === r.toTableId)
        return `FOREIGN KEY (${r.fromColumnId}) REFERENCES ${toTable?.name}(${r.toColumnId})`
      })
      .join(",\n      ")

    return `    const sql_${table.name} = \`
      CREATE TABLE IF NOT EXISTS ${table.name} (
        ${columns}${foreignKeys ? ",\n      " + foreignKeys : ""}
      )
    \`;
    
    await connection.query(sql_${table.name});
    console.log('${table.name} table created');`
  })
  .join("\n\n")}
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.release();
  }
}

createTables();`
  }

  const generateCode = () => {
    switch (language) {
      case "php":
        return generatePHP()
      case "python":
        return generatePython()
      case "nodejs":
      default:
        return generateNodeJS()
    }
  }

  const code = generateCode()

  return (
    <div className="space-y-4">
      <div key="language-select">
        <label className="text-sm font-semibold block mb-2">Select Programming Language</label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nodejs">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-words max-h-[400px] overflow-auto border border-border"
        key="code-display"
      >
        {code}
      </div>

      <Button onClick={() => navigator.clipboard.writeText(code)} className="w-full gap-2" key="copy-button">
        <Copy className="w-4 h-4" />
        Copy Code
      </Button>
    </div>
  )
}
