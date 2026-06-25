export default function SchoolBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 3L4 9V18C4 25.2 10.2 31.2 18 33C25.8 31.2 32 25.2 32 18V9L18 3Z" fill="#f59e0b"/>
        <path d="M18 7L8 12V18C8 23.2 12.4 27.8 18 29.4C23.6 27.8 28 23.2 28 18V12L18 7Z" fill="#fbbf24"/>
        <path d="M14 17l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-semibold text-navy text-sm">{name}</span>
    </div>
  );
}
