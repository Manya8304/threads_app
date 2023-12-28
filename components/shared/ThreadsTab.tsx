import { fetchUserPosts } from "@/lib/actions/thread.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props{
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ( { currentUserId, accountId, accountType} : Props) => {
    //TODO: Now, we need to fetch all th threads that belong to a partiuclar user, in order to display it on the profile page of that user
    let result = await fetchUserPosts(accountId); //coming from database

    if(!result) redirect('/');
    
    return (
        //this is the section inside which we are going to render our posts
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard 
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User' 
                        ? {name: result.name, image: result.image, id: result.id}
                        : {name: thread.author.name, image: thread.author.image, id: thread.author.id}
                    } 
                    //here, we may need to update both author and community to indicate whether we are the owners of the community and whether we are the authors or somebody else's
                    community={thread.community} //update needed(maybe)
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab;