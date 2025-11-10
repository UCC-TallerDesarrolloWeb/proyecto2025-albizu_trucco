import React from 'react';

const Button = React.forwardRef(function Button(
  {
    variant = 'default',
    className = '',
    type = 'button',
    children,
    ...rest
  },
  ref
) {
  const classes = ['btn'];
  if (variant && variant !== 'default') {
    classes.push(variant);
  }
  if (className) {
    classes.push(className);
  }

  return (
    <button ref={ref} type={type} className={classes.join(' ')} {...rest}>
      {children}
    </button>
  );
});

export default Button;

