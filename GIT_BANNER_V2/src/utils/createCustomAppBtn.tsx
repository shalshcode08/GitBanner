import type React from "react";

export const CreateBtn = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <div className="border rounded-md flex items-center justify-center          hover:bg-muted transition-colors">
      <div
        className="px-3 py-3 cursor-pointer text-foreground"
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
};
