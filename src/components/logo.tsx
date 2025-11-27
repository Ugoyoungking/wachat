import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 3.33331C10.8 3.33331 3.33337 9.89998 3.33337 17.9166C3.33337 22.3333 5.56671 26.2333 9.16671 28.8333C9.66671 29.2166 10.0167 29.75 10.15 30.35L11.1334 34.1C11.35 34.9833 12.5 35.3 13.15 34.65L17.1 30.7C17.3834 30.4166 17.75 30.25 18.15 30.25H20C29.2 30.25 36.6667 23.6833 36.6667 15.6666C36.6667 7.64998 29.2 3.33331 20 3.33331Z"
        className="fill-primary"
      />
      <path
        d="M16.4137 11.25L19.997 19.1667L23.5804 11.25H26.6637L21.6637 22.0833H18.3304L13.3304 11.25H16.4137Z"
        fill="hsl(var(--primary-foreground))"
      />
    </svg>
  );
}
