const pool = require('../config/database');

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static async findByUsername(username) {
        try {
            const [rows] = await pool.query('SELECT * FROM powerguild.users WHERE nome = ?', [username]);
            if (rows.length > 0) {
                const { nome: username, email, pwd: password } = rows[0];
                return new User(username, email, password);
            } else {
                return null; // User not found
            }
        } catch (error) {
            console.error("Error finding user by username:", error);
            throw error;
        }
    }

    static async signUp(username, email, password) {
        try {
            const result = await pool.query('INSERT INTO powerguild.users (name, email, pwd) VALUES (?, ?, ?)', [username, email, password]);
            console.log("Insert result:", result);
            return new User(username, email, password);
        } catch (error) {
            console.error("Error signing up user:", error);
            throw error;
        }
    }

    async verifyPassword(password) {
        return this.password === password;
    }
}

module.exports = User;