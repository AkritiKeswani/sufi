import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { POEMS } from "@/lib/poems";
import { WORDS } from "@/lib/words";

// The front door: two ways in, and nothing else.
const DOORS = [
  {
    href: "/shayari",
    urdu: "شاعری",
    title: "Shayari",
    blurb:
      "Scroll through couplets and poems, one at a time, and listen as each is recited.",
    count: `${POEMS.length} verses`,
  },
  {
    href: "/learn",
    urdu: "شاعر بنیے",
    title: "Become a Shayar",
    blurb:
      "Learn the Urdu the poets write in — hear each word, say it, and know what it carries.",
    count: `${WORDS.length} word cards`,
  },
];

export default function Home() {
  return (
    <main className="home flex min-h-screen flex-col items-center px-5 py-6 sm:py-14">
      <div className="w-full max-w-4xl">
        <SiteHeader />
      </div>

      <section className="flex w-full max-w-4xl flex-1 flex-col justify-center py-8 sm:py-12">
        <div className="ornament mx-auto w-24" />
        <h1 className="wordmark mt-6 text-center text-6xl sm:text-8xl">Sufi</h1>
        <p className="label mx-auto mt-4 text-center text-primary">
          Learn the art of shayari
        </p>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          {DOORS.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="verse-card door group flex flex-col px-6 py-6 outline-none sm:px-8 sm:py-10"
            >
              <span dir="rtl" lang="ur" className="verse-urdu text-3xl sm:text-4xl">
                {door.urdu}
              </span>
              <span className="display mt-3 text-xl text-primary sm:mt-6">
                {door.title}
              </span>
              <span className="meaning mt-2 flex-1 text-lg leading-snug sm:mt-3 sm:text-xl">
                {door.blurb}
              </span>
              <span className="label mt-5 flex items-center justify-between text-muted-foreground sm:mt-8">
                {door.count}
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
