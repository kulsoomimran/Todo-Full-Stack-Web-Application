'use client';

import { useState } from 'react';
import ErrorMessage from '../UI/ErrorMessage';

interface TaskFormProps {
  onSubmit: (taskData: { title: string; description?: string; completed?: boolean }) => void;
  onCancel?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    completed?: boolean;
  };
  submitButtonText?: string;
  loading?: boolean;
}

export default function TaskForm({
  onSubmit,
  onCancel,
  initialData = {},
  submitButtonText = 'Add Task',
  loading = false
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Description validation
    if (description && description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: initialData.completed // Preserve the completed status if editing
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
          Title *
        </label>
        <input
          type="text"
          id="task-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors(prev => ({ ...prev, title: undefined }));
            }
          }}
          className="block w-full sm:text-sm rounded-md p-2 border focus:outline-none focus:ring-2 transition-colors"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            borderColor: errors.title ? 'var(--color-danger)' : 'rgba(255,255,255,0.1)',
            borderWidth: '1px',
            outlineColor: errors.title ? 'var(--color-danger)' : 'var(--color-primary)',
          }}
          placeholder="What needs to be done?"
        />
        {errors.title && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
          Description (optional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors(prev => ({ ...prev, description: undefined }));
            }
          }}
          className="block w-full sm:text-sm rounded-md p-2 border focus:outline-none focus:ring-2 transition-colors"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-foreground)',
            borderColor: errors.description ? 'var(--color-danger)' : 'rgba(255,255,255,0.1)',
            borderWidth: '1px',
          }}
          placeholder="Add details..."
          rows={2}
        />
        {errors.description && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.description}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
          style={{
            backgroundColor: loading ? 'rgba(255,255,255,0.1)' : 'var(--color-primary)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Saving...' : submitButtonText}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            style={{
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'var(--color-foreground)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}