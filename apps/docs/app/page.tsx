import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-start justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Xerena UI</h1>
      <p className="text-lg">Cross-platform design system for React and React Native.</p>
      <Link href="/docs" className="underline">
        Read the docs
      </Link>
    </main>
  )
}
