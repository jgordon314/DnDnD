'use client'

import { Button } from "@/app/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export function LongRestButton({ characterId }: { characterId: number }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleLongRest() {
        // Replace with your actual API endpoint and method
        setIsLoading(true);
        console.log("BUTTON PRESSED");
        await fetch("/api/long-rest", {
            method: "POST",
            body: JSON.stringify({ characterId }),
            headers: { "Content-Type": "application/json" }
        });       
         window.location.reload();
    }

    return (
        <Button onClick={handleLongRest} suppressHydrationWarning disabled={isLoading}>
            {isLoading && <Loader2Icon />}
            Take a long rest
        </Button>
        // can suppress warning because the button reloads the page
    );
}
