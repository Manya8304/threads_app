"use client" // this is because because we are going to use forms

import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, //this is the error message that is going to appear if something goes wrong 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrganization } from '@clerk/nextjs';
import { threadValidation } from "@/lib/validations/thread";
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.actions';
//import { updateUser } from '@/lib/actions/users.actions';

interface Props {
    user : {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

function PostThread ({userId} : {userId: string}) {
    const pathname = usePathname();
    const router = useRouter();
    const  { organization } = useOrganization();
    const form = useForm(
        {
            resolver: zodResolver(threadValidation),
            defaultValues: {
                thread: '',
                accountId: userId, //coming from props
            }
        }
    );

    //this function will be called when we will click the "Post Thread" button
    const onSubmit = async (values: z.infer<typeof threadValidation>) => {
            await createThread({
                text: values.thread,
                author: userId,
                communityId: organization ? organization.id : null,
                path: pathname
            });
       

        router.push("/"); //once we have created a new thread, we want that to be visible on home page too!
    }

    return (
        <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-10 flex flex-col justify-start gap-10'>
                <FormField //this is the form field for "name"
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Content
                        </FormLabel>
                        <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                            <Textarea
                                rows={15}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type='submit' className='bg-primary-500'>
                        Post Thread
                    </Button>
        </form>
        </Form>
    )
}

export default PostThread;