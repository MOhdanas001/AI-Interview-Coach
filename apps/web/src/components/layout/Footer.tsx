export function Footer() {
  return (
    <footer className="w-full bg-[#E0E5EC] py-10 px-4 text-center text-xs text-[#6B7280]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-medium">
          © 2026 AI Interview Coach. Built with tactile Neumorphic UI, Next.js, NestJS, TypeScript, Redis & PostgreSQL.
        </p>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-full neu-well-sm text-[#6C63FF] font-bold text-[11px] tracking-wider">
            PHASE 1 FOUNDATION
          </span>
        </div>
      </div>
    </footer>
  );
}
