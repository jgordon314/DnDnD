export function isSameOrigin(url: string) {
    "use client";

    try {
        const targetUrl = new URL(url, window.location.origin);

        return targetUrl.origin === window.location.origin;
    } catch {
        return false;
    }
}
