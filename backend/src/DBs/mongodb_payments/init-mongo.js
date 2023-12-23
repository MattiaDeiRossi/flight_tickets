db.createUser(
    {
        user: "mattia",
        pwd: "pass",
        roles: [
            {
                role: "readWrite",
                db: "payments_db"
            }
        ]
    }
);