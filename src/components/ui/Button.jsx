// src/components/ui/Button.jsx
import './Button.css';

/**
 * Button - A reusable, system-level button component.
 *
 * This component promotes UI consistency across the application. It can render
 * as either a standard <button> or, if an `href` prop is provided, as an
 * anchor <a> tag, while maintaining the same styling.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.href] - If provided, the component renders as an <a> tag.
 * @param {'primary' | 'secondary'} [props.variant='primary'] - The visual style of the button.
 * @param {string} [props.className] - Additional classes to merge.
 * @param {React.ReactNode} props.children - The content inside the button.
 * @param {Function} [props.onClick] - Click handler for the button.
 */
export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  onClick,
  ...rest // Capture any other props like 'target', 'rel', 'aria-label', etc.
}) {
  // Determine if the component should be a link or a button.
  const Tag = href ? 'a' : 'button';

  // Combine the base classes with variant and any custom classes.
  const finalClassName = `
    cta-button
    ${variant === 'secondary' ? 'secondary' : ''}
    ${className}
  `.trim();

  // Props specific to an anchor tag.
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      className={finalClassName}
      onClick={onClick}
      {...linkProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
