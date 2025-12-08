import db from './connection.js'
import bcrypt from 'bcrypt'
import "dotenv/config" 

const saltRounds = 12

async function setup() {

    await db.exec("DROP TABLE IF EXISTS users")
    await db.exec("DROP TABLE IF EXISTS blogs")
    await db.exec("DROP TABLE IF EXISTS questions")

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT,
                username TEXT,
                role TEXT DEFAULT 'user',
                login_count INTEGER DEFAULT 0
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

        await db.exec(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                question TEXT,
                answer TEXT,
                answered_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'pending'
            );
        `)

        //seeding
        const admins =[
            { name: 'Cloe', email: 'cloe@bratz.com' },
            { name: 'Jade', email: 'jade@bratz.com' },
            { name: 'Sasha', email: 'sasha@bratz.com' },
            { name: 'Yasmin', email: 'yasmin@bratz.com' }
        ]

        const adminPassword = process.env.ADMIN_PASS
        const passwordHash = await bcrypt.hash(adminPassword, saltRounds)

        for (const admin of admins) {
            try {
                await db.run(
                    `INSERT INTO users (username, email, password, role, login_count) VALUES (?, ?, ?, ?, ?)`,
                    [admin.name, admin.email, passwordHash, 'admin', 1]
                );
                console.log(`✨ Created Admin: ${admin.name}`)
            } catch (err) {
            //ignore error if they already exist
            }
        }
    
        console.log("✅ Database setup complete.")
    }

setup()