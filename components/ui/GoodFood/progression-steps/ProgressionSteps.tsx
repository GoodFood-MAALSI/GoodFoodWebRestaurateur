import React from "react";
interface ProgressionStepsProps {
  steps: string[];
  current: number;
}
export default function ProgressionSteps({ steps, current }: ProgressionStepsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {steps.map((label, idx) => (
        <div key={idx} className="flex items-center flex-1">
          <div
            className={
              `flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ` +
              (current === idx
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600")
            }
          >
            {idx + 1}
          </div>
          {idx < steps.length - 1 && (
            <div
              className={
                `flex-1 h-1 mx-2 ` +
                (current > idx ? "bg-primary" : "bg-gray-200")
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
