import { Model, connect, model } from 'mongoose';

export function startDB(){
    if(!process.env.MONGODB_URI)
        process.env.MONGODB_URI = 'mongodb://mattia:pass@localhost:27018/flight_tickets_db'
    
    connect(process.env.MONGODB_URI)
        .then(
            () => {
                console.log("Connection with mongodb Successfully".bgGreen);
            }).catch(
                (reason) => {
                    console.log("Error occurred while initializing the db:")
                    console.log(reason);
                }
            )
}