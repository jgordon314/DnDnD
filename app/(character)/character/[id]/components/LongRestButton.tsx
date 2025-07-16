'use client'

export function LongRestButton({ characterId }: { characterId: number }) {
    async function handleLongRest() {
        // Replace with your actual API endpoint and method
        console.log("BUTTON PRESSED");
        await fetch("/api/long-rest", {
            method: "POST",
            body: JSON.stringify({ characterId }),
            headers: { "Content-Type": "application/json" }
        });       
         window.location.reload();
    }

    return (
        <button onClick={handleLongRest} suppressHydrationWarning>
            Take a long rest
        </button>
        // can suppress warning because the button reloads the page
    );
}
