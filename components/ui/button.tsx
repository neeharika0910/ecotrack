import React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string, className?: string }> = ({
  children, className, ...rest
}) => {
  const base = "rounded-md px-4 py-2 font-medium";
  return <button className={`${base} ${className ?? ""}`} {...rest}>{children}</button>;
};
