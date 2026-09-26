export interface EmptyStateOptions {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function renderEmptyState(options: EmptyStateOptions): HTMLElement {
  const container = document.createElement('div');
  container.className = 'empty-state';

  const iconText = options.icon || '📖';

  container.innerHTML = `
    <div class="empty-state-icon" style="font-size: 1.8rem;">
      ${iconText}
    </div>
    <h3 class="empty-state-title">${options.title}</h3>
    <p class="empty-state-desc">${options.description}</p>
    ${options.actionText ? `<button class="btn btn-primary" id="empty-state-action-btn">${options.actionText}</button>` : ''}
  `;

  if (options.actionText && options.onAction) {
    container.querySelector('#empty-state-action-btn')?.addEventListener('click', () => {
      options.onAction?.();
    });
  }

  return container;
}
