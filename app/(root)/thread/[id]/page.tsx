//this page is going to show all the comments under a particular parent thread!

import { fetchUser } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

export const revalidate = 0;

const Page = async ({params} : {params: { id: string }}) => {
    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null;
    //now, we also need to fetch user info from our database
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id);

    return (
    //structure of threads detail page
    <section className="relative">
        <div>
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
            />
         </div>
         {/* Here, we are creating the div for the user to add any comment below the main thread */}
         <div className="mt-7">
            <Comment 
                threadId={params.id}
                currentUserImg={userInfo.image} /* This is going from clerk, therefore we used "user" */
                currentUserId={JSON.stringify(userInfo._id)} // "id" could be a special object, hence by passing it to JSON.stringify() we are just making sure that we are working with string
            />
         </div>

         <div className="mt-10">
            {thread.children.map((childItem: any) => (
                <ThreadCard
                key={childItem._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={childItem.parentId}
                content={childItem.text}
                author={childItem.author}
                community={childItem.community}
                createdAt={childItem.createdAt}
                comments={childItem.children}
                isComment //set to "true" to indicate that we can modify something within this thread card
            />
            ))}
         </div>
    </section>
    )
}

export default Page;

//HOW DO WE GET THE PARAMS OUT OF THE URL?
/*
 Well, we destructure it, then we get the params and within the params the we are going to get the id of the user.
*/