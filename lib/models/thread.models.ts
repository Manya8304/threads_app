import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String,
    }, //here, we are also going to have a parent ID in case this thread is a comment
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread' //here, it will be a reference to itdelf, and hence we can say that we are following recursion, check "*"
        }
    ]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;

/*
 ------------***************************************************--------
 Suppose there is a thread named: thread1 and there are two comments under that thread: thread2 and thread3, and now suppose
 that there is a comment under thread3 named: thread4, hence the structure will look like:-
 thread1
 --thread2
 --thread3
 ----thread4
 so, here, thread1 is a parent of thread2 and thread3
 and thread3 is a parent of thread4, to get this kind of hierarchy, we are going to reference the comment to itself!
*/