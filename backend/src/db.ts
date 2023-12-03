import { connect } from 'mongoose';

const db_string = 'mongodb://mattia:pass@my_mongo:27017/my_restaurant_db';

export function startDB() {
    connect(db_string)
        .then(
            () => {
                console.log("Connection with mongodb Successfully");
            }).catch(
                (reason) => {
                    console.log("Error occurred while initializing the db:")
                    console.log(reason);
                }
            )
}