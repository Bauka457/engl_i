export type ToastType = 'success' | 'info' | 'achievement' | 'error';

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message: string;
  duration?: number;
}

let toastContainer: HTMLElement | null = null;

function getToastContainer(): HTMLElement {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export const Toast = {
  show(options: ToastOptions): void {
    const container = getToastContainer();
    const type = options.type || 'info';
    const duration = options.duration || 3500;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'achievement') icon = '🏆';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${options.title}</div>
        <div class="toast-message">${options.message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, duration);
  }
};
