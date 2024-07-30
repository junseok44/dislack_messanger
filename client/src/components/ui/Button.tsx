import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary'
  paddingVariant?: 'small' | 'medium' | 'large'
}

const variantStyles = {
  primary: 'bg-background-light-DEFAULT text-text-light-DEFAULT',
  secondary: 'bg-background-light-muted text-text-light-subtle',
  tertiary: 'bg-background-light-tertiary text-text-light-muted',
}

const paddingStyles = {
  small: 'py-1 px-2',
  medium: 'py-2 px-4',
  large: 'py-3 px-6',
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  paddingVariant = 'medium',
  className,
  ...props
}) => {
  const buttonClass = twMerge(
    clsx(
      variantStyles[variant],
      paddingStyles[paddingVariant],
      {
        'rounded-md': true,
        'hover:bg-opacity-90': true,
      },
      className
    )
  )

  return (
    <button {...props} className={buttonClass}>
      {props.children}
    </button>
  )
}

export default Button
