import React from "react";

export const Select: React.FC<{ value?: string, onValueChange?: (v: string) => void, children?: React.ReactNode, className?: string }> = ({ value, onValueChange, children, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`w-full border rounded-md px-3 py-2 ${className ?? ""}`}
    >
      {children}
    </select>
  );
};

export const SelectTrigger: React.FC<React.PropsWithChildren> = ({ children }) => <div>{children}</div>;
export const SelectContent: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>;
export const SelectItem: React.FC<{ value: string, children?: React.ReactNode }> = ({ value, children }) => <option value={value}>{children}</option>;
export const SelectValue: React.FC<{ placeholder?: string }> = () => <></>;
