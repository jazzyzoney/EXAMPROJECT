import db from './connection.js'
import bcrypt from 'bcrypt'

const saltRounds = 12

async function setup() {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT,
                username TEXT,
                role TEXT DEFAULT 'user'
            );
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                author TEXT,
                status TEXT DEFAULT 'draft',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `)

        //seeding
        const admins =[
            { name: 'Cloe', email: 'cloe@bratz.com' },
            { name: 'Jade', email: 'jade@bratz.com' },
            { name: 'Sasha', email: 'sasha@bratz.com' },
            { name: 'Yasmin', email: 'yasmin@bratz.com' }
        ]

        const passwordHash = await bcrypt.hash('ADMIN_PASS', saltRounds)

        for (const admin of admins) {
            try {
                await db.run(
                    `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                    [admin.name, admin.email, passwordHash, 'admin']
                );
                console.log(`✨ Created Admin: ${admin.name}`)
            } catch (err) {
            // Ignore error if they already exist
            }
        }
    
        console.log("✅ Database setup complete.")
    }

setup()