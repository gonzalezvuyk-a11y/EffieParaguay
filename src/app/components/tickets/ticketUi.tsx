import { useId, type HTMLAttributes } from 'react';

export const GOLD = '#B89650';
export const SURFACE = 'rgba(17, 17, 17, 0.72)';
export const RULE = '#2a2a2a';
export const TEXT_MUTED = '#B8B8B8';
export const TEXT_SUBTLE = '#999999';
export const ERROR_TEXT = '#F0A090';

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89650]';

export const primaryButton = `min-h-12 rounded-full px-6 font-medium transition-colors touch-manipulation disabled:opacity-50 hover:bg-[#d1b06a] ${focusRing}`;

export const secondaryButton = `min-h-11 rounded-full border px-5 text-sm transition-colors touch-manipulation hover:border-[#B89650] hover:text-white disabled:opacity-50 ${focusRing}`;

type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'search';
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  hint?: string;
  required?: boolean;
};

/** Labeled input with optional hint, styled for the dark ticketing screens. */
export function TextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  hint,
  required = true,
}: TextFieldProps) {
  const id = useId();
  const hintId = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        spellCheck={type === 'email' ? false : undefined}
        aria-describedby={hint ? hintId : undefined}
        className={`w-full min-h-11 rounded-lg border px-3 text-base bg-transparent placeholder:text-[#777777] transition-colors hover:border-[#555555] ${focusRing}`}
        style={{ borderColor: '#333333', color: '#FFFFFF' }}
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs" style={{ color: TEXT_SUBTLE }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/** Full-page dark shell shared by every ticketing screen. */
export function TicketShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative overflow-x-clip pt-36 pb-24" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="container mx-auto px-6 relative z-10">{children}</div>
    </main>
  );
}
