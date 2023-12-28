"use client" // this is because because we are going to use forms

import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { userValidation } from "@/lib/validations/user";
import * as z from 'zod';
import Image from "next/image";
import { ChangeEvent, useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from "@/lib/uploadthing";
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/users.actions';

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

const AccountProfile = ({ user, btnTitle} : Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const pathname = usePathname();
    const router = useRouter();
    const { startUpload } = useUploadThing("media"); //here, we used "uploadThing" as a hook
    const form = useForm<z.infer<typeof userValidation>>(
        {
            resolver: zodResolver(userValidation),
            defaultValues: {
                profile_photo : user?.image || "",
                name: user?.name || "",
                username: user?.username || "",
                bio: user?.bio || ""
            }
        }
    );
    
    //here "e" is the event, i.e. changing the profile photo
    const handleImage = (e : ChangeEvent<HTMLInputElement>, fieldChange : (value: string) => void) => {
        e.preventDefault(); //this will prevent the browser to reload
        const fileReader = new FileReader(); //here we will read the file from the file reader by creating new instance of file reader
        if(e.target.files && e.target.files.length > 0) //here we are checking if there's something, if it is then we are going to read the file by saying:-
        {
            const file = e.target.files[0];
            //then we are going to set files, which is going to be an array
            setFiles(Array.from(e.target.files));

            if(!file.type.includes('image')) return;

            //if the file type is "image" then we are going to read the URL of new image and then update the field using "fieldChange"
            fileReader.onload =async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                //updating the field
                fieldChange(imageDataUrl);
            }

            fileReader.readAsDataURL(file); //this allows us to change the image
        }
    }

    //this function is going to re-upload the new image and it's going to update the user in our database
    const onSubmit = async (values: z.infer<typeof userValidation>)  => {
        //Firstly we will get the value from our profile photo
        const blob = values.profile_photo; //we are setting it using react hook right above using "setFiles" and "fieldChange"
        //usually the value from image is called "blob"
        //as we have the same field-name below, react hook is going to update it automatically
        
        //but we still don't know whether the image has changed or not, so we will firstly check like this:-
        const hasImageChanged = isBase64Image(blob); //this function will come from "utils.ts" and utils are the utilities function that we can reuse across our code
        //this can also be the case that there is already a pic when we sign, so this is only going to work if we re-upload the image
        if(hasImageChanged){
            const imgRes = await startUpload(files) //now we need to get the image response, and then we have to upload it using package called "uploadthing"

            if(imgRes && imgRes[0].url)
            {
                values.profile_photo = imgRes[0].url;
            }
        }
       //now we are ready to submit all of the data that we are getting from the form, therefore here we are going to call a backend function to update the user profile
       //TODO: Update user profile
       await updateUser(
        {
            name: values.name,
            path: pathname,
            username: values.username,
            userId: user.id,
            bio: values.bio,
            image: values.profile_photo,
        }
       );

       if(pathname === '/profile/edit') {
        router.back(); //to go back to the previous page after editing
       } else {
        router.push('/'); //i.e. we want to go to the home-page from the onboarding
       }
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-10'>
                <FormField //this is the form field for "profile photo"
                    control={form.control}
                    name="profile_photo" //field-name 
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                        <FormLabel className='account-form_image-label'>
                            {field.value ? (
                                <Image 
                                 src={field.value} //this is the image provided by the user
                                 alt="profile photo"
                                 width={96}
                                 height={96}
                                 priority
                                 className="rounded-full object-contain"
                                /> //this only works when we have a photo to load
                            ) : (
                                <Image 
                                 src="/assets/profile.svg" //this is the default photo if the pic is not provided by user
                                 alt="profile photo"
                                 width={24}
                                 height={24}
                                 className="object-contain"
                                /> //so this is going to work if no profile pic is provided
                            )}
                        </FormLabel>
                        <FormControl className='flex-1 text-base-semibold text-gray-200'>
                            <Input 
                                type='file' 
                                accept='image/*' //this means it will accept images of all types
                                placeholder='Upload a photo'
                                className='account-form_image-input'
                                onChange={(e) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField //this is the form field for "name"
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type='text' 
                                className='account-form_input no-focus'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField //this is the form field for "username"
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Username
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type='text' 
                                className='account-form_input no-focus'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField //this is the form field for "bio"
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>
                            Bio
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                rows={10} 
                                className='account-form_input no-focus'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <Button type="submit" className='bg-primary-500'>
                    {btnTitle}
                </Button>
                </form>
        </Form>
    );
};

export default AccountProfile;

/*
 We also need to declare the form data that we are going to pass into form.
 In zodResolver we need to provide our own validation, and that validation we are going to create in lib folder.
*/

/*
 "form schema" is actually a z.object(), so for us the form schema is the user validation
*/