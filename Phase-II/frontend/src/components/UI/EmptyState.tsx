import { FC, ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-lg ${className}`} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
      {description && <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;