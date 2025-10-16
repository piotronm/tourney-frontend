import { format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};
