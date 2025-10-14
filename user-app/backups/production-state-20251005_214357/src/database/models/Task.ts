import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class Task extends Model {
  static table = "tasks";

  @field("user_id") userId!: string;
  @field("title") title!: string;
  @field("description") description?: string;
  @field("completed") completed!: boolean;
  @field("priority") priority!: string; // 'low', 'medium', 'high'
  @field("due_date") dueDate?: number;
  @field("category") category?: string; // 'personal', 'work', 'health', 'growth'
  @field("tags") tags?: string; // JSON array
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

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

  get formattedDueDate(): string {
    if (!this.dueDate) return '';
    return new Date(this.dueDate).toLocaleDateString('nl-NL');
  }

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
}
