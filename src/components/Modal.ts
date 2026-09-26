export interface ModalOptions {
  title: string;
  content?: HTMLElement;
  contentHtml?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ModalConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Modal = {
  show(options: ModalOptions): { close: () => void } {
    const existing = document.getElementById('app-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'app-modal-overlay';
    overlay.className = 'modal-overlay';

    const hasConfirm = !!options.confirmText;
    const hasCancel = !!options.cancelText;

    overlay.innerHTML = `
      <div class="modal-content">
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">✕</button>
        <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">${options.title}</h2>
        <div class="modal-body-content" id="modal-body-slot" style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
          ${options.contentHtml || ''}
        </div>
        ${
          hasConfirm || hasCancel
            ? `<div style="display: flex; justify-content: flex-end; gap: 12px;">
                ${hasCancel ? `<button class="btn btn-secondary" id="modal-cancel-btn">${options.cancelText}</button>` : ''}
                ${hasConfirm ? `<button class="btn ${options.danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm-btn">${options.confirmText}</button>` : ''}
              </div>`
            : ''
        }
      </div>
    `;

    const bodySlot = overlay.querySelector('#modal-body-slot') as HTMLElement;
    if (options.content && bodySlot) {
      bodySlot.appendChild(options.content);
    }

    document.body.appendChild(overlay);

    const close = () => {
      overlay.remove();
    };

    overlay.querySelector('#modal-close-btn')?.addEventListener('click', () => {
      close();
      if (options.onCancel) options.onCancel();
    });

    if (hasCancel) {
      overlay.querySelector('#modal-cancel-btn')?.addEventListener('click', () => {
        close();
        if (options.onCancel) options.onCancel();
      });
    }

    if (hasConfirm) {
      overlay.querySelector('#modal-confirm-btn')?.addEventListener('click', () => {
        close();
        if (options.onConfirm) options.onConfirm();
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
        if (options.onCancel) options.onCancel();
      }
    });

    return { close };
  },

  confirm(options: ModalConfirmOptions): { close: () => void } {
    return this.show({
      title: options.title,
      contentHtml: `<p>${options.message}</p>`,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      danger: options.danger,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel
    });
  }
};
