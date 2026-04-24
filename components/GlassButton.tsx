import Link from "next/link";

interface GlassButtonProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export default function GlassButton({
  href,
  children,
  external,
}: GlassButtonProps) {
  const className =
    "glass glass-hover rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 inline-block";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
