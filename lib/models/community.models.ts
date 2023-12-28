import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //as a user can create many threads, which means that threads has to be an object
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread' //a reference to a thread instance stored in database
        },
        //this means that one user can have multiple references to specific threads stored in a database
    ],
    //members is an array because multiple users can belong as members of a specific community
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

const Community = mongoose.models.Community
                    || 
            mongoose.model('Community', CommunitySchema); //creating a mongoose model

export default Community;