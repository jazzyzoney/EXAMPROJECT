import bcrypt from "bcrypt"

const saltRounds = 12

export async function hashedPassword(password) {
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(comparePassword, hashedPassword) {
    return await bcrypt.compare(comparePassword, hashedPassword)
}