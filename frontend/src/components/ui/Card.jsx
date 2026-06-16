import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = true, delay = 0, ...props }) => {
  const CardComponent = hoverEffect ? motion.div : 'div';

  const motionProps = hoverEffect
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay },
        whileHover: { y: -4, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <CardComponent
      className={`glass-card rounded-2xl p-6 transition-colors duration-300 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
