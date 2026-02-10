'use client';

import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, updatedTask: Partial<Task>) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSaveEdit = () => {
    if (onEdit && editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        updated_at: new Date().toISOString()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit();
    }
  };

  return (
    <li className="flex flex-col">
      {isEditing ? (
        <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 rounded text-sm"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid rgba(255,255,255,0.04)' }}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 rounded text-sm"
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid rgba(255,255,255,0.04)' }}
            rows={2}
            placeholder="Description (optional)"
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
              className="px-3 py-1 rounded text-sm font-medium transition-opacity"
              style={{ 
                backgroundColor: !editTitle.trim() ? '#9ca3af' : 'var(--color-success)',
                color: 'white',
                opacity: !editTitle.trim() ? 0.6 : 1,
                cursor: !editTitle.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 rounded text-sm font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--color-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3 p-4 rounded-lg hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--color-background)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="h-5 w-5 rounded mt-0.5 cursor-pointer flex-shrink-0"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium break-words transition-all ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}
                style={{ color: task.completed ? 'var(--color-muted)' : 'var(--color-foreground)' }}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm mt-1 break-words" style={{ color: 'var(--color-muted)' }}>
                  {task.description}
                </p>
              )}
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2 ml-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)' }}
              title="Edit task"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2 py-1 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: 'rgba(251,113,133,0.08)', color: 'var(--color-danger)' }}
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}