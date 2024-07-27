export const Divider = ({
  className,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  return <div className={`h-[0.5px] bg-text-light-muted ${className}`}></div>;
};
