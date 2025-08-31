import React from "react";

interface ProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
  color?: string;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  color = "#FF5722",
  animate = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full`}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            transition: animate ? "width 1s ease-in-out" : undefined,
          }}
        ></div>
      </div>
    </div>
  );
};
