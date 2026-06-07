export interface ToastConfig {
  message: string;
  type?: 'success' | 'info' | 'error';
}

export function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
  const event = new CustomEvent('show-toast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}
