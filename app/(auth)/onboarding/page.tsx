import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();
    const userInfo = {};
    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,
    }
    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads!
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;

/*
 Now, we can also pass some data to "AccountProfile", such as the data about current-user, using the inbuilt
 feature provided by clerk, i.e. currentUser.
 Before passing the user data to AccountProfile, we are going to create an object, this object will have:-
 a. objectId:- which will later come from database, so we will have our instance of the user in the database as well, so that we can attach different threads to them
 b. ID:- which is the actually ID of the user
*/

// user?.id ---> here, we have added "?" to ensure that the "id" exists.

/*
 const userInfo = {}; ---> this is the new fetch user, the data of user which is fetched from the database and not that of the currently logged in user
 const user = await currentUser(); ---> this will be the data of currently logged user fetched from clerk.
*/