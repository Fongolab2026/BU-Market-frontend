import { Link } from 'react-router-dom'

export default function PageErreur() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <section className="w-full max-w-lg rounded-xl bg-white p-10 text-center shadow-lg">
        <p className="text-7xl font-bold text-blue-700">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Page introuvable
        </h1>
        <p className="mt-3 text-slate-600">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-md bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    </main>
  )
}
