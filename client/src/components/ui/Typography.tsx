import React from 'react'

interface TypographyProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  weight?: 'light' | 'normal' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'accent' | 'muted'
  fontFamily?: 'sans' | 'serif' | 'mono'
  children: React.ReactNode
  leadingNone?: boolean
}

const sizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  xlarge: 'text-xl',
}

const weightClasses = {
  light: 'font-light',
  normal: 'font-normal',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorClasses = {
  primary: 'text-text-dark',
  secondary: 'text-text-dark-muted',
  accent: 'text-red-500',
  muted: 'text-gray-500',
}

const fontFamilyClasses = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const Typography: React.FC<TypographyProps> = ({
  size = 'medium',
  weight,
  color,
  fontFamily = 'sans',
  children,
  leadingNone = true,
}) => {
  const sizeClass = sizeClasses[size]
  const weightClass = weight ? weightClasses[weight] : ''
  const colorClass = color ? colorClasses[color] : ''
  const fontFamilyClass = fontFamilyClasses[fontFamily]

  return (
    <div
      className={`${sizeClass} ${weightClass} ${colorClass} ${fontFamilyClass} ${
        leadingNone ? 'leading-none' : ''
      }`}
    >
      {children}
    </div>
  )
}

export default Typography
