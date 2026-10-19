import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function IconButton({ label, className = '', children, ...rest }: Props) {
  return (
    <button type="button" className={`icon-btn ${className}`.trim()} aria-label={label} {...rest}>
      {children}
    </button>
  );
}
