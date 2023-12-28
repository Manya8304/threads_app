"use server"

import { connectToDB } from "../mongoose"
import User from "../models/users.models"
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.models";

//Now we need to connect to our database, i.e. mongoose, so we created :- "mongoose.ts"
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    path: string;
    image: string;
}
//now here we have created a new function to update the user, and this function is going to return a Promise of type: void
export async function updateUser({
    userId,
    username,
    name,
    bio,
    path,
    image,
}: Params): Promise<void> {
    try {
        connectToDB();
        //Now we can start making calls to our database, but to actually modify our database we need to have "models"
        await User.findOneAndUpdate(
            { id: userId }, //using this we will find the user we want to update
            //now once we find the user we want to update, we want to actually apply the updates, and that is going to go into the second object of this function
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true 
                // "upsert" basically means:- "update" & "insert"
                // "upsert" is a database operation that will update an existing row, if a specific value already exists and insert a new row if the specified value doesn't already exists.
            }
            );

        if(path === '/profile/edit') {
            revalidatePath(path);
        }
        //"revalidatePath" allows you to revalidate data associated with a specific path. This is useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire.
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
        }
}

//now here we are creating an action to fetch the data of user from database
export async function fetchUser(userId: string) {
    try {
        connectToDB();
        return await User.findOne({ id: userId })
        /*
        .populate({
            path: 'communities',
            model: Community
        })*/
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`); 
    }
}

/*
 populate() is a method that lets you pull in referenced documents from another collection. It is used to “look up” 
 documents from other collections and merge them into the current document.This is especially useful for creating 
 relationships between documents in different collections.
 Hence, this function will help us to find all the different communities, which are joined by the currently logged in user.
*/

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc" //meaning --> descending
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try{
        connectToDB();
        
        //here, also we are going to implement the pagination property similar to what we have done for posts
        //so, here firstly we need to calculate the number of users to skip based on the page number and page size
        const skipAmount = (pageNumber - 1 ) * pageSize;
        
        //then we need to create a case insensitive regular  expression for when we are searching the users
        const regex = new RegExp(searchString, "i"); //second parameter:- "i" means that that it is case-insensitive
        
        //now we can proceed with the functionality of fetching and sorting
        //we can create an initial query to get the users
        const query: FilterQuery<typeof User> = {
            id: {$ne: userId} //"ne" means not-equal-to, as in to filter out our current user
        }

        if(searchString.trim() !== '') {
            query.$or = [
                //here, we are searching both by name and username
                {username: { $regex: regex }},
                { name: { $regex: regex }}
            ];
        }

        //as we have done:- searching, fetching and skipping, now we are gonna do "sorting"
        const sortOptions = { createdAt: sortBy};
        
        //now we will finally get the users based on all of these searching, skipping and sorting
        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);
        
        //now we are going to use total number of users to know the total number of pages for the users
        const totalUsersCount = await User.countDocuments(query);
        
        //now we as we have the user query we can finally execute it
        const users = await usersQuery.exec();
        
        //now, we can use the total users count to know whether there is a next page or not
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch(error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        //find all threads created by user
        const userThreads = await Thread.find({author: userId});

        //Collect all the child thread ids (replies) from the 'children' filed
        /*
        Example:-
        const userThreads = [
            {
                id: 100,
                children: ['This is bad', 'This is terrible']
            } ,
            {
                id: 101,
                children: ['OMG, Too good!!', 'Loved it!', 'This is bad']
            }
            then :-
            childThreads = [This is bad', 'This is terrible','OMG, Too good!!', 'Loved it!']
        ]
        */
       const childThreads = userThreads.reduce((acc, userThreads) => {
        return acc.concat(userThreads.children);
       }, [])

       //now, we need to get access to all the replies excluding the ones created the user itself
       const replies = await Thread.find({
        _id: { $in: childThreads },
        author: { $ne: userId }  //excluding the comments made by the user iself
       }).populate({
        path: 'author',
        model: User,
        select: 'name image _id',
       })

       return replies;
    } catch (error) {
        
    }
}

/*
 This function helps someone find all the comments they received on theri posts from others. 
 It gathers all the comments from different places, puts them together and shows then to the person.
 If there's a problem then it tells the person something went wrong.
*/

