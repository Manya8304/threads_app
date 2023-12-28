import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import ThreadCard  from "@/components/cards/ThreadCard";

export default async function Home()
{ //Inside homepage, we will start by fetching the posts
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? ( //here we are checking whether there exists any post to display on Home page
          <p className="no-result">No threads found!</p>
        ) : ( //if there exists some posts then we are going to have another react element
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.comments}
                />
            ))}
          </>
        )}
      </section>
    </>
  )
}