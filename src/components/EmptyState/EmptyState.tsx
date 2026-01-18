import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionLink,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FileText size={48} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="empty-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
