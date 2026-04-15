import { Button, type ButtonProps } from 'react-aria-components';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'love' | 'ghost' | 'pixel';

export interface PixelButtonProps extends ButtonProps {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  love: 'btn btn-love',
  ghost: 'btn btn-ghost',
  pixel: 'btn-pixel',
};

export function PixelButton({ variant = 'primary', className, ...props }: PixelButtonProps) {
  return <Button {...props} className={clsx(variantClass[variant], className)} />;
}
