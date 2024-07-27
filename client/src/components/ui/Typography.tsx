import React from "react";

interface TypographyProps {
  size?: "small" | "medium" | "large";
  weight?: "light" | "normal" | "semibold" | "bold";
  color?: "primary" | "secondary" | "accent" | "muted";
  fontFamily?: "sans" | "serif" | "mono";
  children: React.ReactNode;
}

const sizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

const weightClasses = {
  light: "font-light",
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorClasses = {
  primary: "text-blue-500",
  secondary: "text-gray-700",
  accent: "text-red-500",
  muted: "text-gray-500",
};

const fontFamilyClasses = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

const Typography: React.FC<TypographyProps> = ({
  size = "medium",
  weight,
  color,
  fontFamily = "sans",
  children,
}) => {
  const sizeClass = sizeClasses[size];
  const weightClass = weight ? weightClasses[weight] : "";
  const colorClass = color ? colorClasses[color] : "";
  const fontFamilyClass = fontFamilyClasses[fontFamily];

  return (
    <span
      className={`${sizeClass} ${weightClass} ${colorClass} ${fontFamilyClass} leading-none`}
    >
      {children}
    </span>
  );
};

export default Typography;
