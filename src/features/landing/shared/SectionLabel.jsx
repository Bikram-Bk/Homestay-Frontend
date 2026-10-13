export default function SectionLabel({ children, light = false }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <div className={`h-px w-10 ${light ? "bg-mustard/50" : "bg-terracotta"}`} />
      <span
        className={`font-sans text-[11px] uppercase tracking-[0.22em] font-semibold ${
          light ? "text-mustard" : "text-terracotta"
        }`}
      >
        {children}
      </span>
      <div className={`h-px w-10 ${light ? "bg-mustard/50" : "bg-terracotta"}`} />
    </div>
  );
}
