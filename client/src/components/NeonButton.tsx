import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick: () => void;
  color?: "orange" | "purple" | "blue" | "green" | "red" | "gray";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function NeonButton({ 
  children, 
  onClick, 
  color = "orange", 
  size = "medium",
  disabled = false,
  type = "button"
}: NeonButtonProps) {
  const colorClasses = {
    orange: "neon-button-orange",
    purple: "neon-button-purple", 
    blue: "neon-button-blue",
    green: "neon-button-green",
    red: "neon-button-red",
    gray: "neon-button-gray"
  };

  const sizeClasses = {
    small: "neon-button-small",
    medium: "neon-button-medium",
    large: "neon-button-large"
  };

  return (
    <button
      type={type}
      className={`neon-button ${colorClasses[color]} ${sizeClasses[size]} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="neon-button-text">{children}</span>
      <div className="neon-button-glow"></div>
    </button>
  );
}
