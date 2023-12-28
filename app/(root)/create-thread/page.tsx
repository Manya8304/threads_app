import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/users.actions";
import PostThread  from "@/components/forms/PostThread";

async function Page() {
    const user = await currentUser();

    //clerk will automatically redirect us if we are not logged in!
    //if there's no user currently looged in:-
    if(!user) return null;

    //but if there is a user then we will fetch it's data from database
    const userInfo = await fetchUser(user.id);
    //here, "fetchUser" is another action that we need to create!
    if(!userInfo?.onboarded) redirect('/onboarding'); //this for the users that simply type the url in the chrome

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userInfo._id}/>
        </>
    ) 
}

export default Page;

//using this page, firstly we want to know which user is currently creating the thread, and we will do that with the help of clerk:- currentUser