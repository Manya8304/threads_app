import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from 'next/font/google'
import '../globals.css';

export const metadata = {
    title : 'Threads',
    description : 'A Next.js 13 Meta Threads Application'
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
    return ( //within this cleark provider, we are going to return an HTML page
        <ClerkProvider> 
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}> 
                <div className="w-full items-center justify-center min-h-screen">
                    {children}
                </div>
                </body>
            </html>
        </ClerkProvider>
    )
}

