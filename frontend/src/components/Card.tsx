import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
