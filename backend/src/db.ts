import { connect } from 'mongoose';

export function startDB() {
    connect(process.env.MONGODB_URI)
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