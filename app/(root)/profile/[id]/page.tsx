import { fetchUser } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({ params } : { params: { id: string }}) {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(params.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <section>
            <ProfileHeader 
                accountId={userInfo.id} //id of the user we are looking for, whose pofile we are checking
                authUserId={user.id} //here, we are checking whether the user is looking at its own profile or any other user
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                {/* Here, we render the tabs within the profile page, displaying the threads of the user, replies on threads, communites and tagged  &
                 these tabs are gonna come from ShadCN*/}
                 <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {/* Now we want to loop over our tabs and these tabs are saved within our constants, and there we have profileTabs and communityTabs */}
                        {profileTabs.map((tab) => (
                            /* Now, we want to instantly return TabsTrigger for each one of these tabs, like a button opening the tab */
                         <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image 
                             src={tab.icon}
                             alt={tab.label}
                             width={24}
                             height={24}
                             className="object-contain"
                            />
                            <p className="max-sm:hidden">{tab.label}</p> {/* As, we can't fit both icon and label on smaller devices, hence in smaller devices are going to hide the label */}
                            {/* Now, in case of threads tab, along with the icon and label we also want to show how many threads a particular user has created, so this below 
                             block of code will only work in case of threads and will show the number of threads created by a particular user */}
                             {tab.label === 'Threads' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {userInfo?.threads?.length}
                                </p>
                             )}
                         </TabsTrigger>   
                        ))}
                    </TabsList>
                    {/* Now, as we have displayed the number of threads created, now we also want to display the actual threads on the profile page */}
                    {profileTabs.map((tab) => (
                        <TabsContent 
                            key={`content-${tab.label}`} 
                            value={tab.value} 
                            className="w-full text-light-1"
                        >
                            <ThreadsTab 
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType="User" 
                            //here, we are passing this information to check whether we are the creator of the threads on the profile that we are viewing, and if we are the creator of the threads, then there is going to be a delete button 
                            />
                        </TabsContent>
                    ))}
                 </Tabs>
            </div>
        </section>
    )
}

export default Page;