'use client';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react"
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar(){
    const { data: session } = useSession();
    console.log("Session data:", session);

    return (
        <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">MyApp</div>
            <ul className="flex space-x-4">
            <li><Link href="/" className="text-white hover:text-gray-400">Home</Link></li>
            <li><a href="/about" className="text-white hover:text-gray-400">About</a></li>
            <li><a href="/contact" className="text-white hover:text-gray-400">Contact</a></li>
            <li><Button onClick={() => signOut()}>Cerrar Sesión</Button></li>
            </ul>
        </div>
        </nav>
    );  
}