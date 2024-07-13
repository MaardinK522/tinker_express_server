const sqlite3 = require("sqlite3");

class DatabaseManager {
    constructor() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = this;
            sqlite3.verbose();
            this.userCredentialDatabaseConnection = null;
            this.userTableName = 'users';
            this.connectedToDB().then(r => console.log(r));
        }
        return DatabaseManager.instance;
    }

    async connectedToDB() {
        if (!this.userCredentialDatabaseConnection) {
            this.userCredentialDatabaseConnection = await new Promise((resolve, reject) => {
                const connection = new sqlite3.Database('./user_credentials.db', (err) => {
                    if (err) {
                        console.error('Error connecting to database', err);
                        return reject(err);
                    } else {
                        console.log('Connected to database');
                        const query = `CREATE TABLE IF NOT EXISTS ${this.userTableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`;
                        connection.run(query, (err) => {
                            if (err) console.error('Error connecting to database', err); else console.log('User table created or connected successfully.');
                        });
                        resolve(connection);
                    }
                });
            });
        }
        return this.userCredentialDatabaseConnection;
    }

    // Creating the users in the database.
    async add_user_credentials(user) {
        const email = user.email;
        const password = user.password;
        return new Promise((resolve, reject) => {
            const statement = `INSERT INTO ${this.userTableName} (username, password) VALUES (?, ?)`;
            this.userCredentialDatabaseConnection.prepare(statement, (err, query) => {
                if (err) {
                    console.error('Error preparing statement:', err);
                    reject(err);
                } else {
                    query.run(email, password, (err) => {
                        query.finalize();
                        if (err) {
                            console.error('Error adding user to the database.', err);
                            reject(err);
                        } else {
                            console.log(`User ${email} added successfully.`);
                            resolve();
                        }
                    });
                }
            });
        });
    }

    // Checking if the user exists in the database or not.
    async checkUserExists(email) {
        return new Promise((resolve, reject) => {
            const statement = `SELECT 1 FROM ${this.userTableName} WHERE username = ${email}`;
            this.userCredentialDatabaseConnection.get(statement, [email], (err, row) => {
                if (err) {
                    console.error('Error checking for existing user:', err);
                    reject(err);
                } else {
                    resolve(!!row); // Convert row to boolean (true if exists, false otherwise)
                }
            });
        });
    }

    // Deleting the users from the database.
    async removeUser(email) {
        return new Promise((resolve, reject) => {
            const statement = `DELETE FROM ${this.userTableName} WHERE username = ${email}`;
            this.userCredentialDatabaseConnection.run(statement, [email], (err) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    reject(err);
                } else {
                    console.log(`User with email "${email}" deleted successfully.`);
                    resolve();
                }
            });
        });
    }
}

module.exports = DatabaseManager; // Optional: Export the class for testing purposes
