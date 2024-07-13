const DatabaseManager = (function () {
    let INSTANCE;

    class DatabaseManager {
        constructor() {
            if (!INSTANCE) {
                INSTANCE = this;
                console.log('Instance is created');
            }
        }

        // TODO: Add the user given from the request the DB.
        add_user(user) {
            console.log(`User is : ${user.name}`);
        }
    }

    return {
        getInstance: function () {
            if (!INSTANCE) {
                this.INSTANCE = new DatabaseManager();
                console.log('Instance is returned');
                return INSTANCE;
            }
            return INSTANCE;
        }
    }
})

export {DatabaseManager};
