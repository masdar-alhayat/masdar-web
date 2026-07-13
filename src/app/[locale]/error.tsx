"use client";
export default function ErrorPage({reset}: {error: Error; reset: () => void}) { return <main className="error-page"><span>MAH</span><h1>Something went wrong.</h1><p>We could not load this page. Please try again.</p><button onClick={reset}>Try again</button></main>; }
