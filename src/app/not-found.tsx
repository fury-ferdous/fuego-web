import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section grid min-h-[70svh] place-items-center">
      <div className="shell text-center">
        <p className="eyebrow">404</p>
        <h1 className="display display-lg mt-5">Diese Tür ist zu.</h1>
        <p className="lede mx-auto mt-6">
          Die Seite gibt es nicht – die Location schon. Sieh dich stattdessen in der 360°-Tour um.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
          <Link href="/#tour" className="btn btn-ghost">
            360°-Tour
          </Link>
        </div>
      </div>
    </section>
  );
}
