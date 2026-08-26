export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 AI Interview Coach. Built with Next.js, NestJS, TypeScript, Tailwind, Redis, Postgres & OpenAI Realtime API.</p>
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono">
            Phase 1 Foundation
          </span>
        </div>
      </div>
    </footer>
  );
}
