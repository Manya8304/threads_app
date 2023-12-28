/*
 This file simply needs to contain "generateReactHelpers" --> It is a function used to generate the "useUploadThing" hoook 
 and "uploadFiles" functions to interact with UploadThing
*/

import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

//Here, we have to create an additional file in the "api" route becuase of course we have to have backend  for image upload.