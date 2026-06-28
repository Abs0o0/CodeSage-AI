import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter password",
  name = "password",
  autoComplete = "current-password",
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="set-field">
      {label && <label htmlFor={id}>{label}</label>}

      <div className="password-field">
        <input
          id={id}
          name={name}
          className="set-input password-input"
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}