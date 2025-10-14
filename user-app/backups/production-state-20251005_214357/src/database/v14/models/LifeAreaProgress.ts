import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class LifeAreaProgress extends Model {
  static table = 'life_areas_progress'

  @field('user_id') userId!: string
  @field('area_name') areaName!: string
  @field('progress_level') progressLevel!: number
  @field('notes') notes!: string
  @field('goals') goals!: string | null // JSON array
  @field('achievements') achievements!: string | null // JSON array
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get parsedGoals() {
    try {
      return this.goals ? JSON.parse(this.goals) : []
    } catch {
      return []
    }
  }

  get parsedAchievements() {
    try {
      return this.achievements ? JSON.parse(this.achievements) : []
    } catch {
      return []
    }
  }

  get progressPercentage() {
    return Math.min(Math.max(this.progressLevel, 0), 100)
  }

  get progressColor() {
    if (this.progressLevel >= 80) return 'success'
    if (this.progressLevel >= 60) return 'warning'
    if (this.progressLevel >= 40) return 'primary'
    return 'danger'
  }

  get areaNameLabel() {
    const labels = {
      'career': 'Carrière',
      'relationships': 'Relaties',
      'health': 'Gezondheid',
      'finance': 'Financiën',
      'personal_growth': 'Persoonlijke Groei',
      'spirituality': 'Spiritualiteit',
      'social_life': 'Sociaal Leven',
      'hobbies': 'Hobby\'s'
    }
    return labels[this.areaName as keyof typeof labels] || this.areaName
  }

  async updateProgress(updates: Partial<{progressLevel: number; notes: string; goals: string[]; achievements: string[];}>) {
    await this.update(progress => {
      if (updates.progressLevel !== undefined) progress.progressLevel = updates.progressLevel
      if (updates.notes !== undefined) progress.notes = updates.notes
      if (updates.goals !== undefined) progress.goals = JSON.stringify(updates.goals)
      if (updates.achievements !== undefined) progress.achievements = JSON.stringify(updates.achievements)
      progress.updatedAt = new Date()
    })
  }

  async addGoal(goal: string) {
    const currentGoals = this.parsedGoals
    if (!currentGoals.includes(goal)) {
      currentGoals.push(goal)
      await this.update(progress => {
        progress.goals = JSON.stringify(currentGoals)
        progress.updatedAt = new Date()
      })
    }
  }

  async addAchievement(achievement: string) {
    const currentAchievements = this.parsedAchievements
    if (!currentAchievements.includes(achievement)) {
      currentAchievements.push(achievement)
      await this.update(progress => {
        progress.achievements = JSON.stringify(currentAchievements)
        progress.updatedAt = new Date()
      })
    }
  }
}