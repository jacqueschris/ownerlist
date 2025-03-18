'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Label } from './ui/label';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useDisplayContext } from '@/contexts/Display';
import { HomeScreen } from './screens/home-screen';

interface HeaderProps {
    title: string
    showBack?: boolean
}

export default function Header({
    title,
    showBack = false
}: HeaderProps) {

    const { setDisplay, setShowAddPropertyButton } = useDisplayContext();

    const handleBack = () => {
        setDisplay(<HomeScreen />);
        setShowAddPropertyButton(true);
    };

    return (
        <div className="border-b bg-blue flex">
            
            <Image src="/logo.png" alt="logo" width={120} height={40}></Image>
            {showBack &&
                <Button variant="ghost" size="icon" className="m-auto ml-2 mr-0 hover:bg-gray" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5 text-white" />
                </Button>
            }
            <h1 className="text-xl font-bold text-white m-auto ml-2">{title}</h1>
        </div>
    );
}
