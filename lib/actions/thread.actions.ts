"use server" //if we will not use this then it will throw an error
import { threadId } from "worker_threads";
//the error occurs because we can't directly create database actions through the browser side
/*
 One reason is of course, cross origin requests, it doesn't allow it that's why we develop the APIs & new servers.
 Databases are msotly server or API  services.
 So, this simple Next.js directive:- "use server" makes it all work.
*/

import User from "../models/users.models";
import { connectToDB } from "../mongoose";
import Thread from "@/lib/models/thread.models";
import { revalidatePath } from "next/cache";

interface Params{
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({
    text,
    author,
    communityId,
    path
} : Params) {
   try {
        connectToDB();

        const createdThread = await Thread.create({
            text, 
            author, 
            community: null,
        });

        //Now, as the user has created a new thread, therefore we need to push that thread to that particular user
        //update the user model
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })
        revalidatePath(path);
   } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`);
   }
}

//Here, just like "user", "thread" is a mongoose MongoDB model which we are going to create!

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    //we can also implement pagination, to implement that we also need to calculate on which page we are on now
    //so, we need to calculate the number of posts to skip depending on which page we are
    const skipAmount = (pageNumber - 1) * pageSize; //here, we did "pageNumber-1" because the 1st page is going to immediately show the posts

    //Fetch the threads that have no parents (top-level threads...) --> check *
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
        .sort({ createdAt: 'desc'}) //this means that we want the threads that are recently created
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            model: User, 
            path: 'author'
        })
        .populate({ //we are populating to even consider the comments under that particular thread
            path: 'children', //this is to ensure that if we have any comments
            populate: { 
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })
        //then we need to know the total post count becuase we are going to need it later on for the total number of pages
        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})
        const posts = await postsQuery.exec();
        //now here we are checking if there exists next page or not!
        const isNext = totalPostsCount > skipAmount + posts.length;
        //and if it does then we are returning the posts of that page, and boolean value of "isNext" to tell there exists another pae!
        return { posts, isNext };

}

/*
-------------**************-----------------
We are interestd in the real threads and not the comments and hence we are checking that the parentId is either
"null" or "undefined"!!
*/

export async function fetchThreadById(id : string) {
    connectToDB();
    try{
        //TODO: Populate Community
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select : "_id id name image"
        })
        .populate({
            path: 'children', //this for the comments under comments, so here we need to populate recursively
            populate: [
                {
                    path: 'author',
                    model : User,
                    select: "_id id name parentId image",
                },
                {
                    path: 'children',
                    model: 'Thread',
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image",
                    },
                },
            ],
        }).exec();
        return thread;
    } catch(error: any)
    {
        throw new Error(`Error fetching thread: ${error.message}`);
    }
}

export async function addCommentToThread(
        threadId: string,
        commentText: string,
        userId: string,
        path: string,
) {
    connectToDB();
    try{
        //Find original thread by its ID
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) {
            throw new Error("Thread not found!!");
        }
        //Create a new thread with comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })
        //Save the new thread
        const savedCommetThread = await commentThread.save();

        //Update the original thread to include new comment
        originalThread.children.push(savedCommetThread._id);

        //Save the original thread
        await originalThread.save();

        revalidatePath(path);
    } catch(error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try{
        connectToDB();
        //Find all threads authored bu user with the given userId
        const threads = await User.findOne({id: userId})
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id',
                }
            }
        })
        return threads;
    } catch(error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
}