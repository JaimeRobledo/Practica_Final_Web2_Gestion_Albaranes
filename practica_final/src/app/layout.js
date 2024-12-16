import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link"
import {Noto_Sans_JP} from 'next/font/google'
import IRSLogo from './images/IRS.png';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>IRS</title>
        <meta name="description" content=""></meta>
        <meta name="keyword" content=""></meta>
      </head>
      <body className="bg-gray-100 min-h-full">

        

        <main className="p-0">{children}</main>
      </body>
    </html>
  );
}
