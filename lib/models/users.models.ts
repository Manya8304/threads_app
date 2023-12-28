import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
         type: String, 
         required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    image: String,
    bio: String,
    //as a user can create many threads, which means that threads has to be an object
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread' //a reference to a thread instance stored in database
        }
        //this means that one user can have multiple references to specific threads stored in a database
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    //because once we create an account, we have to go through onboarding, where we choose our profile phot, bio & the username
    communities:[ //one user can belong to many communities
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community' //a reference to a community instance stored  in the database
        }
    ]
});

const User = mongoose.models.User 
                    || 
            mongoose.model('User', userSchema); //creating a mongoose model
//BUT WHY ARE WE DOING THIS WAY?
/*
 Well for the first time the Mongoose models is not going to exist, so it is going to fall back to creating a mongoose model
 user based on the userSchema but every second time we call it, it's already going to have a mongoose model in the database, 
 so it's going to know to create it off of that instance
*/

export default User;