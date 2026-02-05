import type { SVGProps } from 'react';

export function VoiceGuardLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-primary"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M7 11.5a5 5 0 0 1 10 0" />
      <path d="M9 11.5a3 3 0 0 1 6 0" />
      <path d="M11 11.5a1 1 0 0 1 2 0" />
    </svg>
  );
}
