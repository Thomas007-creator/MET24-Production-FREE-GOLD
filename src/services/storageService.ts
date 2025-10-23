/**
 * Storage Service for MET24 Phase 1
 * 
 * Handles file storage and data persistence
 * 
 * @version 3.0.0-core
 */

export interface StorageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string | ArrayBuffer;
  uploadedAt: Date;
  userId: string;
}

export interface StorageConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
}

export class StorageService {
  private config: StorageConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/json',
      'text/csv'
    ],
    maxFiles: 100
  };

  private files: Map<string, StorageFile> = new Map();
  private readonly STORAGE_KEY = 'met24_storage_files';

  constructor() {
    this.loadFromLocalStorage();
  }

  /**
   * Upload file
   */
  async uploadFile(file: File, userId: string): Promise<StorageFile> {
    try {
      // Validate file
      this.validateFile(file);

      // Check storage limits
      await this.checkStorageLimits(userId);

      // Convert file to data
      const data = await this.fileToData(file);

      // Create storage file
      const storageFile: StorageFile = {
        id: this.generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        data,
        uploadedAt: new Date(),
        userId
      };

      // Store file
      this.files.set(storageFile.id, storageFile);
      await this.saveToLocalStorage();

      console.log('Storage Service: File uploaded successfully', storageFile.name);
      return storageFile;
    } catch (error) {
      console.error('Storage Service: Error uploading file', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<StorageFile | null> {
    try {
      return this.files.get(fileId) || null;
    } catch (error) {
      console.error('Storage Service: Error getting file', error);
      return null;
    }
  }

  /**
   * Get files by user
   */
  async getFilesByUser(userId: string): Promise<StorageFile[]> {
    try {
      return Array.from(this.files.values())
        .filter(file => file.userId === userId)
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    } catch (error) {
      console.error('Storage Service: Error getting files by user', error);
      return [];
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const file = this.files.get(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      this.files.delete(fileId);
      await this.saveToLocalStorage();

      console.log('Storage Service: File deleted successfully', file.name);
    } catch (error) {
      console.error('Storage Service: Error deleting file', error);
      throw error;
    }
  }

  /**
   * Update file
   */
  async updateFile(fileId: string, updates: Partial<StorageFile>): Promise<StorageFile> {
    try {
      const file = this.files.get(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      const updatedFile = { ...file, ...updates };
      this.files.set(fileId, updatedFile);
      await this.saveToLocalStorage();

      console.log('Storage Service: File updated successfully', updatedFile.name);
      return updatedFile;
    } catch (error) {
      console.error('Storage Service: Error updating file', error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    usedSpace: number;
    availableSpace: number;
  }> {
    try {
      const userFiles = await this.getFilesByUser(userId);
      const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
      const maxStorage = 100 * 1024 * 1024; // 100MB per user

      return {
        totalFiles: userFiles.length,
        totalSize,
        usedSpace: totalSize,
        availableSpace: maxStorage - totalSize
      };
    } catch (error) {
      console.error('Storage Service: Error getting storage stats', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        usedSpace: 0,
        availableSpace: 0
      };
    }
  }

  /**
   * Export files
   */
  async exportFiles(userId: string): Promise<string> {
    try {
      const files = await this.getFilesByUser(userId);
      const exportData = {
        files: files.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: file.uploadedAt.toISOString()
        })),
        exportedAt: new Date().toISOString(),
        version: '3.0.0-core'
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Storage Service: Error exporting files', error);
      throw error;
    }
  }

  /**
   * Import files
   */
  async importFiles(userId: string, jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.files && Array.isArray(importData.files)) {
        for (const fileData of importData.files) {
          // Create mock file for import
          const mockFile = new File([''], fileData.name, { type: fileData.type });
          
          const storageFile: StorageFile = {
            id: fileData.id,
            name: fileData.name,
            type: fileData.type,
            size: fileData.size,
            data: '',
            uploadedAt: new Date(fileData.uploadedAt),
            userId
          };

          this.files.set(storageFile.id, storageFile);
        }
        
        await this.saveToLocalStorage();
      }

      console.log('Storage Service: Files imported successfully');
    } catch (error) {
      console.error('Storage Service: Error importing files', error);
      throw error;
    }
  }

  /**
   * Validate file
   */
  private validateFile(file: File): void {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.config.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
  }

  /**
   * Check storage limits
   */
  private async checkStorageLimits(userId: string): Promise<void> {
    const stats = await this.getStorageStats(userId);
    
    if (stats.totalFiles >= this.config.maxFiles) {
      throw new Error(`Maximum number of files (${this.config.maxFiles}) reached`);
    }

    if (stats.usedSpace >= 100 * 1024 * 1024) { // 100MB limit
      throw new Error('Storage quota exceeded');
    }
  }

  /**
   * Convert file to data
   */
  private async fileToData(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string | ArrayBuffer);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save to local storage
   */
  private async saveToLocalStorage(): Promise<void> {
    try {
      const data = Array.from(this.files.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Storage Service: Error saving to local storage', error);
    }
  }

  /**
   * Load from local storage
   */
  private loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const entries = JSON.parse(data);
        this.files = new Map(entries);
      }
    } catch (error) {
      console.error('Storage Service: Error loading from local storage', error);
    }
  }

  /**
   * Clear all files
   */
  async clearAllFiles(): Promise<void> {
    try {
      this.files.clear();
      await this.saveToLocalStorage();
      console.log('Storage Service: All files cleared');
    } catch (error) {
      console.error('Storage Service: Error clearing all files', error);
      throw error;
    }
  }

  /**
   * Get file URL
   */
  getFileURL(file: StorageFile): string {
    if (file.type.startsWith('image/')) {
      return `data:${file.type};base64,${file.data}`;
    } else if (file.type.startsWith('text/')) {
      return `data:${file.type};charset=utf-8,${encodeURIComponent(file.data as string)}`;
    } else {
      return `data:${file.type};base64,${file.data}`;
    }
  }

  /**
   * Download file
   */
  downloadFile(file: StorageFile): void {
    try {
      const url = this.getFileURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Storage Service: Error downloading file', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
