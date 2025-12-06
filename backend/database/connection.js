import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../auth.db')

const connection = await open({
    filename: dbPath,
    driver: sqlite3.Database
})

console.log('✅ Connected to SQLite database at:', dbPath)

export default connection