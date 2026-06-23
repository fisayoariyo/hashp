import { Eye, EyeOff } from "lucide-react";

/**
 * Password input with show/hide toggle.
 * Uses a remount key + type switch so iOS Safari updates masked text reliably.
 */
export default function PasswordField({
  value,
  onChange,
  visible = false,
  onToggleVisible,
  placeholder,
  autoComplete,
  onKeyDown,
  prefix: PrefixIcon,
  wrapperClassName = "",
  inputClassName = "flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none",
  showToggle = true,
  id,
  name,
}) {
  return (
    <div className={wrapperClassName}>
      {PrefixIcon ? <PrefixIcon size={18} className="text-brand-text-muted shrink-0" /> : null}
      <input
        key={visible ? "password-visible" : "password-masked"}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={inputClassName}
      />
      {showToggle && onToggleVisible ? (
        <button
          type="button"
          onClick={onToggleVisible}
          className="shrink-0 text-brand-text-muted hover:text-brand-text-primary touch-manipulation inline-flex items-center justify-center"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
