import sqlite3 from 'sqlite3' // allows u to create queries through the connection 
import { open } from 'sqlite' //opens the connection

// open the database
const connection = await open({
    filename: 'auth.db',
    driver: sqlite3.Database
})

export default connection