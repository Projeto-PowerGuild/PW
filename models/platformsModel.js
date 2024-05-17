"use strict";

const pool = require("../config/database");

class Platform {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async getAll() {
        try {
            const [rows] = await pool.query("SELECT * FROM platforms");
            console.log("Query Result:", rows); // Log query result
            return rows;
        } catch (error) {
            console.error("Error fetching platforms:", error);
            throw error;
        }
    }    
}

module.exports = Platform;