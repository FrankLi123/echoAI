import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Head } from "next/document"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Chat bot",
    description: "Chat bot",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-theme="synthwave">
                <body className={inter.className}>
                    {children}
                </body>
            </html>
    )
}
