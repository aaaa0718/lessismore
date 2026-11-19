export default function ActionButton({ variant = 'primary', className = '', type = 'button', children, ...props }) {
  return <button type={type} className={`ui-button ui-button--${variant} ${className}`} {...props}>
    {children}
  </button>;
}
