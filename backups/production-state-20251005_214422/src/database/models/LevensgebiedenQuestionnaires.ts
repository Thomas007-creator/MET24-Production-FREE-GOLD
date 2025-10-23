import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class LevensgebiedenQuestionnaires extends Model {
  static table = "levensgebieden_questionnaires";

  @field("user_id") userId!: string;
  @field("levensgebied") levensgebied!: string; // psychischeGezondheid, lichamelijkeGezondheid, etc.
  @field("answers_json") answersJson!: string; // JSON string van alle antwoorden
  @field("total_score") totalScore!: number; // Gemiddelde score van alle antwoorden
  @field("completed_at") completedAt!: number;
  @field("assessment_type") assessmentType!: string; // 'initial', 'follow_up', 'progress_check'
  @field("mbti_type") mbtiType!: string; // User's MBTI type at time of assessment
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Helper methods
  get parsedAnswers() {
    try {
      return JSON.parse(this.answersJson);
    } catch {
      return {};
    }
  }

  get levensgebiedLabel() {
    const labels = {
      psychischeGezondheid: "🧠 Psychische Gezondheid",
      lichamelijkeGezondheid: "💪 Lichamelijke Gezondheid",
      financieen: "💰 Financiën",
      werkSamenleving: "💼 Werk & Samenleving",
      hobbyPassies: "🎨 Hobby's & Passies",
      actieveImaginatie: "🧘 Actieve Imaginatie",
      professioneleOntwikkeling: "📈 Professionele Ontwikkeling",
      socialeRelaties: "❤️ Sociale en Liefdesrelaties",
      thuisOmgeving: "🏡 Thuis en Omgeving",
    };
    return (
      labels[this.levensgebied as keyof typeof labels] || this.levensgebied
    );
  }

  get progressPercentage() {
    return Math.min(Math.max(this.totalScore, 0), 100);
  }

  get progressColor() {
    if (this.totalScore >= 8) return "success";
    if (this.totalScore >= 6) return "warning";
    if (this.totalScore >= 4) return "primary";
    return "danger";
  }

  get progressLabel() {
    if (this.totalScore >= 8) return "Uitstekend";
    if (this.totalScore >= 6) return "Goed";
    if (this.totalScore >= 4) return "Gemiddeld";
    return "Aandacht nodig";
  }

  // Update answers and recalculate total score
  async updateAnswers(answers: { [key: string]: number }, mbtiType?: string) {
    const answersJson = JSON.stringify(answers);
    const totalScore =
      Object.values(answers).reduce((sum, value) => sum + value, 0) /
      Object.values(answers).length;

    await this.update((record) => {
      record.answersJson = answersJson;
      record.totalScore = totalScore;
      record.completedAt = Date.now();
      if (mbtiType) record.mbtiType = mbtiType;
      record.updatedAt = new Date();
    });
  }

  // Get specific answer for a question
  getAnswer(questionId: string): number {
    const answers = this.parsedAnswers;
    return answers[questionId] || 0;
  }

  // Get all answers as array
  getAllAnswers(): number[] {
    const answers = this.parsedAnswers;
    return Object.values(answers);
  }

  // Check if assessment is recent (within last 30 days)
  get isRecent(): boolean {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return this.completedAt > thirtyDaysAgo;
  }

  // Get time since completion
  get timeSinceCompletion(): string {
    const now = Date.now();
    const diff = now - this.completedAt;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (days === 0) return "Vandaag";
    if (days === 1) return "Gisteren";
    if (days < 7) return `${days} dagen geleden`;
    if (days < 30) return `${Math.floor(days / 7)} weken geleden`;
    return `${Math.floor(days / 30)} maanden geleden`;
  }
}
