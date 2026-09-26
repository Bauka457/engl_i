import { StorageService } from './storage';

export const ExportService = {
  downloadBackup(): void {
    try {
      const dataStr = StorageService.exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `english-journey-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download backup', e);
      throw e;
    }
  },

  exportData(): void {
    this.downloadBackup();
  },

  async importData(file: File): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await this.readAndImportFile(file);
    return {
      success: res.success,
      message: res.message,
      error: res.success ? undefined : res.message
    };
  },

  async readAndImportFile(file: File): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      if (!file.name.endsWith('.json')) {
        resolve({ success: false, message: 'Invalid file format. Please upload a JSON backup file.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const ok = StorageService.importAllData(content);
          if (ok) {
            resolve({ success: true, message: 'Progress and data restored successfully!' });
          } else {
            resolve({ success: false, message: 'Invalid backup file structure.' });
          }
        } catch (err) {
          resolve({ success: false, message: 'Failed to parse JSON backup file.' });
        }
      };

      reader.onerror = () => {
        resolve({ success: false, message: 'Error reading selected file.' });
      };

      reader.readAsText(file);
    });
  }
};
