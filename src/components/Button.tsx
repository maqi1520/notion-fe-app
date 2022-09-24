import clsx from "clsx";
import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        className,
        `bg-transparent border-blue-500 border rounded px-4 py-2 text-sm inline-flex items-center text-blue-500 active:bg-blue-500 active:text-white`,
        {
          "opacity-20 cursor-not-allowed": props.disabled,
        }
      )}
    >
      {children}
    </button>
  );
};
