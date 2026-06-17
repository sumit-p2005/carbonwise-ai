import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  required = false,
  helperText,
  ...props
}, ref) => {
  const errorId = error && id ? `${id}-error` : undefined;
  const helperId = helperText && id ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={id}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border ${
          error
            ? 'border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
        } text-slate-900 dark:text-white rounded-xl text-sm transition-all focus:outline-none focus:ring-4 ${className}`}
        {...props}
      />
      
      {error && (
        <span id={errorId} role="alert" className="text-xs text-rose-500 font-medium mt-0.5">
          {error}
        </span>
      )}
      
      {!error && helperText && (
        <span id={helperId} className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
