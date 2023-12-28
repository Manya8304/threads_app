import * as z from 'zod';

export const userValidation = z.object({
    profile_photo : z.string().url().min(1), //this means that the profile photo is a string of type "url" and is non-empty.
    name: z.string().min(3).max(30),
    username : z.string().min(3).max(30),
    bio : z.string().min(3).max(1000),
})

// Here, min(3, message: ERROR MESSAGE), we can also pass the error message in this way