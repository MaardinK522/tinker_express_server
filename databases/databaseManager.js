// const DatabaseManager = (function () {
//     let INSTANCE;
//
//     class DatabaseManager {
//         constructor() {
//             if (!INSTANCE) {
//                 INSTANCE = this;
//                 console.log('Instance is created');
//             }
//         }
//
//         // TODO: Add the user given from the request the DB.
//         add_user(user) {
//             console.log(`User is : ${user.name}`);
//         }
//     }
//
//     return {
//         getInstance: function () {
//             if (!INSTANCE) {
//                 this.INSTANCE = new DatabaseManager();
//                 console.log('Instance is returned');
//                 return INSTANCE;
//             }
//             return INSTANCE;
//         }
//     }
// })
//
// export {DatabaseManager};

const sqlite3 = require("sqlite3");

class DatabaseManager {
    constructor() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = this;
            sqlite3.verbose();
            this.databaseConnection = null;
            this.userTableName = 'users';
            this.connectedToDB().then(r => console.log(r));
        }
        return DatabaseManager.instance;
    }

    async connectedToDB() {
        if (!this.databaseConnection) {
            this.databaseConnection = await new Promise((resolve, reject) => {
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
        return this.databaseConnection;
    }

    // Creating the users in the database.
    async add_user_credentials(user) {
        const email = user.email;
        const password = user.password;
        return new Promise((resolve, reject) => {
            const statement = `INSERT INTO ${this.userTableName} (username, password) VALUES (?, ?)`;
            this.databaseConnection.prepare(statement, (err, query) => {
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
            this.databaseConnection.get(statement, [email], (err, row) => {
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
            this.databaseConnection.run(statement, [email], (err) => {
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

// // Usage:
// const dbManager = new DatabaseManager(); // Singleton instance
//
// dbManager.connectedToDB()
//   .then(() => dbManager.add_user_credentials({ email: 'user@example.com', password: 'hashed_password' }))
//   .then(() => console.log('User added successfully'))
//   .catch((err) => console.error('Error:', err));

module.exports = DatabaseManager; // Optional: Export the class for testing purposes
