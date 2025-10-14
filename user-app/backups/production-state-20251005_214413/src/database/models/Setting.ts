import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Setting extends Model {
  static table = 'settings'

  @field('user_id') userId!: string
  @field('key') key!: string
  @field('value') value!: string
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get parsedValue() {
    try {
      return JSON.parse(this.value)
    } catch {
      return this.value
    }
  }

  get booleanValue() {
    if (typeof this.parsedValue === 'boolean') {
      return this.parsedValue
    }
    return this.value === 'true'
  }

  get numberValue() {
    const parsed = parseFloat(this.value)
    return isNaN(parsed) ? 0 : parsed
  }

  async updateValue(newValue: string | number | boolean | any) {
    await this.update(setting => {
      setting.value = typeof newValue === 'object' 
        ? JSON.stringify(newValue) 
        : String(newValue)
      setting.updatedAt = new Date()
    })
  }
}
