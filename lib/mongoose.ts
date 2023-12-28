import mongoose from 'mongoose';

let isConnected = false; // variable to check if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); //this is to prevent unknown field queries
    //then we need to have a specific MongoDB URL to connect to and if it is not there then:-
    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found!');
    //then we can check if we are already connected
    if(isConnected) return console.log('Already connected to MongoDB');
    //and if these two are not the cases then we can open a new try and catch block and we can try to make a connection
    //but now as to make a connection we need to have an active instance of MongoDB
    try{
        console.log("Connecting to MongoDB");
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch(error)
    {
        console.log(error);
    }
};