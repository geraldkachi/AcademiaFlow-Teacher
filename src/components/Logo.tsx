export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: { w: 22, text: 'text-sm' }, md: { w: 28, text: 'text-base' }, lg: { w: 36, text: 'text-xl' } }[size];
  console.log(s)
  return (
    <div className="flex items-center gap-2">
        <img src="gen-logo.svg" alt="www" />
      {/* <svg width={s.w} height={s.w} viewBox="0 0 36 36" fill="none">
        <path d="M18 4L2 12L18 20L34 12L18 4Z" fill="#0f2d40"/>
        <path d="M6 15.5V24C6 24 10 28 18 28C26 28 30 24 30 24V15.5L18 21.5L6 15.5Z" fill="#16a34a"/>
        <rect x="32" y="12" width="2" height="10" rx="1" fill="#0f2d40"/>
        <circle cx="33" cy="23" r="2" fill="#0f2d40"/>
      </svg>
      <span className={`font-bold ${s.text} text-navy`}>Academia<span className="text-primary">Flow</span></span> */}
    </div>
  );
}
