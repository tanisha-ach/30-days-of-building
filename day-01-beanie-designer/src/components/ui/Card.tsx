import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div' | 'article';
  children: ReactNode;
};

export function Card({ as: Tag = 'section', className = '', children, ...rest }: Props) {
  return (
    <Tag className={`card ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
