db.createUser(
    {
        user: "mattia",
        pwd: "pass",
        roles: [
            {
                role: "readWrite",
                db: "flight_tickets_db"
            }
        ]
    }
);