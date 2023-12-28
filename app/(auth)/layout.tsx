import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'
import '../globals.css';
import React from "react";
import { dark } from "@clerk/themes";
import { Metadata } from "next";

export const metadata: Metadata = {
    title : 'Auth',
    description : 'A Next.js 13 Meta Threads Application',
}

const inter = Inter(
    {
        subsets : ["latin"]
    }
)

export default function RootLayout({
    children //props
 } : {
    children : React.ReactNode //type of the props
}) {
    return ( //within this clerk provider, we are going to return an HTML page
        <ClerkProvider 
            appearance={{
                baseTheme: dark,
            }}
        > 
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}> 
                 <div className="w-full flex justify-center items-center min-h-screen"> 
                    {children}
                 </div> 
                </body>
            </html>
        </ClerkProvider>
    );
}

