// src/hooks/use-toast.ts

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const toast = ({ title, description }: ToastOptions) => {
  // For now, we just use a simple alert
  alert(`${title}${description ? ': ' + description : ''}`);

  // Later you can replace this with a fancy toast library, e.g., react-hot-toast
};
