db.createUser(
    {
        user: "mattia",
        pwd: "pass",
        roles: [
            {
                role: "readWrite",
                db: "users_db"
            }
        ]
    }
);