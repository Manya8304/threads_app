import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes : ['/', '/api/webhook/clerk'],
    ignoredRoutes : ['/api/webhook/clerk']
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 
// '/api/webhook/clerk' ---> we are going to use this later on to enable the webhook functionalities  for our organizations
// "ignoredRoutes" ---> the routes whihc are going to be ignored by the clerk