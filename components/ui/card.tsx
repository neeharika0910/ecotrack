import React from "react";

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`rounded-2xl p-4 bg-white shadow ${className ?? ""}`}>{children}</div>
);

export const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`mb-2 ${className ?? ""}`}>{children}</div>
);

export const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className ?? ""}`}>{children}</h3>
);

export const CardDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <p className={`text-sm text-gray-500 ${className ?? ""}`}>{children}</p>
);

export const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={className}>{children}</div>
);
