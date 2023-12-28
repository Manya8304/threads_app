import * as z from 'zod';

export const userValidation = z.object({
    profile_photo : z.string().url().min(1), //this means that the profile photo is a string of type "url" and is non-empty.
    name: z.string()
            .min(3, { message: "Minimum 3 characters." })
            .max(30, { message: "Maximum 30 caracters." }),
    username : z.string()
            .min(3, { message: "Minimum 3 characters." })
            .max(30, { message: "Maximum 30 caracters." }),
    bio : z.string()
            .min(3, { message: "Minimum 3 characters." })
            .max(1000, { message: "Maximum 1000 caracters." }),
})

// Here, min(3, message: ERROR MESSAGE), we can also pass the error message in this way