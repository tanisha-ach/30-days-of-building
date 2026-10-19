import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function TextField({ className = '', error, ...rest }: InputProps) {
  return (
    <input
      className={`select ${error ? 'input-error' : ''} ${className}`.trim()}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export function SelectField({ className = '', error, children, ...rest }: SelectProps) {
  return (
    <select
      className={`select ${error ? 'input-error' : ''} ${className}`.trim()}
      aria-invalid={error || undefined}
      {...rest}
    >
      {children}
    </select>
  );
}
