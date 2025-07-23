"use client";
export function ActivateSpell({
    spellId, characterId
}: {
    spellId: number,
    characterId: number;
}) {
    return (
        <button className="activate" onClick={() => {
            fetch(`/api/characters/${characterId}/${spellId}`, {
                method: "GET",
            }); window.location.reload();
        }} suppressHydrationWarning> 
            Activate
        </button>
        // hydration warning doesn't matter because we reload
    )
}
