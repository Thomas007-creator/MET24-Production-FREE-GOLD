/**
 * Task Model - WatermelonDB V14
 * 
 * Model class voor tasks tabel
 * Bevat alle task data en helper methods
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export class TaskV14 extends Model {
  static table = "tasks";

  // Relaties
  @field("user_id") userId!: string;
  
  // Task data
  @field("title") title!: string;
  @field("description") description?: string;
  @field("completed") completed!: boolean;
  @field("priority") priority!: string; // 'low', 'medium', 'high'
  @field("due_date") dueDate?: number;
  @field("category") category?: string; // 'personal', 'work', 'health', 'growth'
  @field("tags") tags?: string; // JSON array
  
  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;

  // Helper methods
  get parsedTags(): string[] {
    try {
      return this.tags ? JSON.parse(this.tags) : [];
    } catch {
      return [];
    }
  }

  get isOverdue(): boolean {
    if (!this.dueDate || this.completed) return false;
    return this.dueDate < Date.now();
  }

  get priorityColor(): string {
    switch (this.priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  }

  get priorityIcon(): string {
    switch (this.priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  get formattedDueDate(): string {
    if (!this.dueDate) return '';
    return new Date(this.dueDate).toLocaleDateString('nl-NL');
  }

  get timeUntilDue(): string {
    if (!this.dueDate) return '';
    
    const now = Date.now();
    const diff = this.dueDate - now;
    
    if (diff < 0) return 'Overdue';
    if (diff < 86400000) return 'Today'; // 24 hours
    if (diff < 172800000) return 'Tomorrow'; // 48 hours
    
    const days = Math.ceil(diff / 86400000);
    return `${days} days`;
  }

  get categoryIcon(): string {
    switch (this.category) {
      case 'personal': return '👤';
      case 'work': return '💼';
      case 'health': return '🏥';
      case 'growth': return '🌱';
      case 'relationships': return '💕';
      case 'finance': return '💰';
      case 'hobbies': return '🎨';
      default: return '📝';
    }
  }

  get statusText(): string {
    if (this.completed) return 'Completed';
    if (this.isOverdue) return 'Overdue';
    return 'Pending';
  }

  get statusColor(): string {
    if (this.completed) return 'success';
    if (this.isOverdue) return 'danger';
    return 'warning';
  }

  // Update methods
  async toggleCompleted(): Promise<void> {
    await this.update((task: any) => {
      task.completed = !task.completed;
      task.updatedAt = Date.now();
    });
  }

  async updateTask(updates: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: number;
    category?: string;
    tags?: string[];
  }): Promise<void> {
    await this.update((task: any) => {
      if (updates.title !== undefined) task.title = updates.title;
      if (updates.description !== undefined) task.description = updates.description;
      if (updates.priority !== undefined) task.priority = updates.priority;
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
      if (updates.category !== undefined) task.category = updates.category;
      if (updates.tags !== undefined) task.tags = JSON.stringify(updates.tags);
      task.updatedAt = Date.now();
    });
  }

  async addTag(tag: string): Promise<void> {
    const currentTags = this.parsedTags;
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      await this.update((task: any) => {
        task.tags = JSON.stringify(currentTags);
        task.updatedAt = Date.now();
      });
    }
  }

  async removeTag(tag: string): Promise<void> {
    const currentTags = this.parsedTags.filter(t => t !== tag);
    await this.update((task: any) => {
      task.tags = JSON.stringify(currentTags);
      task.updatedAt = Date.now();
    });
  }

  async setDueDate(dueDate: number): Promise<void> {
    await this.update((task: any) => {
      task.dueDate = dueDate;
      task.updatedAt = Date.now();
    });
  }

  async setPriority(priority: 'low' | 'medium' | 'high'): Promise<void> {
    await this.update((task: any) => {
      task.priority = priority;
      task.updatedAt = Date.now();
    });
  }

  async setCategory(category: string): Promise<void> {
    await this.update((task: any) => {
      task.category = category;
      task.updatedAt = Date.now();
    });
  }
}
