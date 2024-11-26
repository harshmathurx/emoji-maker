"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import CreditsDisplay from './credits-display';
import Link from 'next/link';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex items-center justify-between w-full px-4 py-4">
            <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Pixar Poster Creator</span>
            </Link>
            <div className="flex items-center space-x-4">
                <SignedIn>
                    <Link href="/profile">
                        <Button variant="ghost">Profile</Button>
                    </Link>
                    <CreditsDisplay />
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}