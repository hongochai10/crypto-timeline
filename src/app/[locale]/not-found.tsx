export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary,#080b14)]">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary,#e0e0e0)]">
          Page not found
        </h2>
        <p className="text-sm text-[var(--text-muted,#888)]">
          The requested page could not be found.
        </p>
      </div>
    </div>
  );
}
