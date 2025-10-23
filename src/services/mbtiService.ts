/**
 * MBTI Service for MET24 Phase 1
 * 
 * Handles MBTI assessment, scoring, and results
 * 
 * @version 3.0.0-core
 */

import { databaseV14 } from '../database/v14/databaseV14';

export interface MBTIQuestion {
  id: string;
  question: string;
  dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  reverse: boolean;
}

export interface MBTIAnswer {
  questionId: string;
  answer: number; // 1-5 scale
  timestamp: Date;
}

export interface MBTIScore {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MBTIResult {
  type: string;
  score: MBTIScore;
  percentage: MBTIScore;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  timestamp: Date;
}

export class MBTIService {
  private questions: MBTIQuestion[] = [];
  private answers: MBTIAnswer[] = [];

  constructor() {
    this.initializeQuestions();
  }

  /**
   * Initialize MBTI questions
   */
  private initializeQuestions(): void {
    this.questions = [
      // Extraversion vs Introversion
      { id: 'E1', question: 'Ik voel me energiek in grote groepen mensen', dimension: 'E', reverse: false },
      { id: 'I1', question: 'Ik heb tijd alleen nodig om op te laden', dimension: 'I', reverse: false },
      { id: 'E2', question: 'Ik praat graag over mijn ideeën met anderen', dimension: 'E', reverse: false },
      { id: 'I2', question: 'Ik denk eerst na voordat ik spreek', dimension: 'I', reverse: false },
      
      // Sensing vs Intuition
      { id: 'S1', question: 'Ik focus op concrete details en feiten', dimension: 'S', reverse: false },
      { id: 'N1', question: 'Ik zie graag het grote plaatje en mogelijkheden', dimension: 'N', reverse: false },
      { id: 'S2', question: 'Ik werk graag met praktische, tastbare dingen', dimension: 'S', reverse: false },
      { id: 'N2', question: 'Ik ben geïnteresseerd in abstracte concepten', dimension: 'N', reverse: false },
      
      // Thinking vs Feeling
      { id: 'T1', question: 'Ik maak beslissingen gebaseerd op logica', dimension: 'T', reverse: false },
      { id: 'F1', question: 'Ik overweeg de impact op mensen bij beslissingen', dimension: 'F', reverse: false },
      { id: 'T2', question: 'Ik ben eerlijk, ook als het pijnlijk is', dimension: 'T', reverse: false },
      { id: 'F2', question: 'Ik probeer harmonie te behouden in relaties', dimension: 'F', reverse: false },
      
      // Judging vs Perceiving
      { id: 'J1', question: 'Ik houd van structuur en planning', dimension: 'J', reverse: false },
      { id: 'P1', question: 'Ik ben flexibel en spontaan', dimension: 'P', reverse: false },
      { id: 'J2', question: 'Ik werk graag met deadlines en lijsten', dimension: 'J', reverse: false },
      { id: 'P2', question: 'Ik houd opties open en pas me aan', dimension: 'P', reverse: false }
    ];
  }

  /**
   * Get all MBTI questions
   */
  getQuestions(): MBTIQuestion[] {
    return this.questions;
  }

  /**
   * Add an answer to the assessment
   */
  addAnswer(questionId: string, answer: number): void {
    const existingAnswerIndex = this.answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      this.answers[existingAnswerIndex] = {
        questionId,
        answer,
        timestamp: new Date()
      };
    } else {
      this.answers.push({
        questionId,
        answer,
        timestamp: new Date()
      });
    }
  }

  /**
   * Get current answers
   */
  getAnswers(): MBTIAnswer[] {
    return this.answers;
  }

  /**
   * Calculate MBTI score
   */
  calculateScore(): MBTIScore {
    const score: MBTIScore = {
      E: 0, I: 0, S: 0, N: 0,
      T: 0, F: 0, J: 0, P: 0
    };

    this.answers.forEach(answer => {
      const question = this.questions.find(q => q.id === answer.questionId);
      if (question) {
        const value = question.reverse ? (6 - answer.answer) : answer.answer;
        score[question.dimension] += value;
      }
    });

    return score;
  }

  /**
   * Calculate MBTI percentages
   */
  calculatePercentages(score: MBTIScore): MBTIScore {
    const totalQuestions = this.questions.length / 4; // 4 questions per dimension pair
    
    return {
      E: Math.round((score.E / (totalQuestions * 5)) * 100),
      I: Math.round((score.I / (totalQuestions * 5)) * 100),
      S: Math.round((score.S / (totalQuestions * 5)) * 100),
      N: Math.round((score.N / (totalQuestions * 5)) * 100),
      T: Math.round((score.T / (totalQuestions * 5)) * 100),
      F: Math.round((score.F / (totalQuestions * 5)) * 100),
      J: Math.round((score.J / (totalQuestions * 5)) * 100),
      P: Math.round((score.P / (totalQuestions * 5)) * 100)
    };
  }

  /**
   * Determine MBTI type
   */
  determineType(score: MBTIScore): string {
    const type = 
      (score.E > score.I ? 'E' : 'I') +
      (score.S > score.N ? 'S' : 'N') +
      (score.T > score.F ? 'T' : 'F') +
      (score.J > score.P ? 'J' : 'P');
    
    return type;
  }

  /**
   * Get MBTI type description
   */
  getTypeDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'INTJ': 'De Architect - Strategisch, onafhankelijk en besluitvaardig',
      'INTP': 'De Denker - Innovatief, nieuwsgierig en logisch',
      'ENTJ': 'De Commandant - Moedig, wilskrachtig en een geboren leider',
      'ENTP': 'De Debater - Slim, nieuwsgierig en vindingrijk',
      'INFJ': 'De Advocaat - Creatief, inspirerend en vastberaden',
      'INFP': 'De Mediator - Idealistisch, nieuwsgierig en loyaal',
      'ENFJ': 'De Protagonist - Charismatisch, inspirerend en natuurlijk leider',
      'ENFP': 'De Kampioen - Enthousiast, creatief en sociaal',
      'ISTJ': 'De Logistiek - Praktisch, betrouwbaar en verantwoordelijk',
      'ISFJ': 'De Verdediger - Warm, betrouwbaar en toegewijd',
      'ESTJ': 'De Uitvoerder - Efficiënt, betrouwbaar en praktisch',
      'ESFJ': 'De Consul - Extravert, zorgzaam en sociaal',
      'ISTP': 'De Virtuoos - Praktisch, flexibel en charmant',
      'ISFP': 'De Avonturier - Flexibel, charmant en spontaan',
      'ESTP': 'De Ondernemer - Slim, energiek en waarnemend',
      'ESFP': 'De Entertainer - Spontaan, energiek en enthousiast'
    };

    return descriptions[type] || 'Onbekend type';
  }

  /**
   * Get MBTI type strengths
   */
  getTypeStrengths(type: string): string[] {
    const strengths: { [key: string]: string[] } = {
      'INTJ': ['Strategisch denken', 'Onafhankelijkheid', 'Besluitvaardigheid', 'Focus op lange termijn'],
      'INTP': ['Logisch denken', 'Objectiviteit', 'Nieuwsgierigheid', 'Flexibiliteit'],
      'ENTJ': ['Leiderschap', 'Efficiëntie', 'Zelfvertrouwen', 'Besluitvaardigheid'],
      'ENTP': ['Creativiteit', 'Flexibiliteit', 'Enthousiasme', 'Intellectuele nieuwsgierigheid'],
      'INFJ': ['Empathie', 'Creativiteit', 'Intuïtie', 'Toewijding'],
      'INFP': ['Authenticiteit', 'Empathie', 'Flexibiliteit', 'Passie'],
      'ENFJ': ['Leiderschap', 'Empathie', 'Charisma', 'Toewijding'],
      'ENFP': ['Enthousiasme', 'Creativiteit', 'Sociale vaardigheden', 'Flexibiliteit'],
      'ISTJ': ['Betrouwbaarheid', 'Praktisch', 'Verantwoordelijk', 'Gedetailleerd'],
      'ISFJ': ['Zorgzaam', 'Betrouwbaar', 'Praktisch', 'Loyaal'],
      'ESTJ': ['Organisatie', 'Efficiëntie', 'Betrouwbaarheid', 'Praktisch'],
      'ESFJ': ['Zorgzaam', 'Sociaal', 'Betrouwbaar', 'Praktisch'],
      'ISTP': ['Praktisch', 'Flexibel', 'Onafhankelijk', 'Probleemoplossend'],
      'ISFP': ['Flexibel', 'Empathisch', 'Authentiek', 'Artistiek'],
      'ESTP': ['Energiek', 'Praktisch', 'Sociaal', 'Flexibel'],
      'ESFP': ['Enthousiast', 'Sociaal', 'Flexibel', 'Optimistisch']
    };

    return strengths[type] || [];
  }

  /**
   * Get MBTI type challenges
   */
  getTypeChallenges(type: string): string[] {
    const challenges: { [key: string]: string[] } = {
      'INTJ': ['Perfectionisme', 'Kritisch', 'Onafhankelijk', 'Stubborn'],
      'INTP': ['Praktische details', 'Sociale situaties', 'Besluiteloosheid', 'Emotionele expressie'],
      'ENTJ': ['Ongevoeligheid', 'Ongezondheid', 'Intolerantie', 'Ongevoeligheid'],
      'ENTP': ['Ongevoeligheid', 'Intolerantie', 'Ongevoeligheid', 'Ongevoeligheid'],
      'INFJ': ['Perfectionisme', 'Sensitief', 'Privé', 'Stubborn'],
      'INFP': ['Overgevoelig', 'Perfectionistisch', 'Onpraktisch', 'Stubborn'],
      'ENFJ': ['Overgevoelig', 'Fluctuerend', 'Over-idealistisch', 'Te zelfopofferend'],
      'ENFP': ['Overgevoelig', 'Ongeorganiseerd', 'Onpraktisch', 'Overdenken'],
      'ISTJ': ['Stubborn', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ISFJ': ['Humeurig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ESTJ': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ESFJ': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ISTP': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ISFP': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ESTP': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig'],
      'ESFP': ['Ongevoelig', 'Ongevoelig', 'Ongevoelig', 'Ongevoelig']
    };

    return challenges[type] || [];
  }

  /**
   * Get MBTI type recommendations
   */
  getTypeRecommendations(type: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'INTJ': ['Ontwikkel sociale vaardigheden', 'Wees geduldiger met anderen', 'Deel je visie', 'Zoek feedback'],
      'INTP': ['Werk aan praktische vaardigheden', 'Deel je ideeën', 'Wees besluitvaardiger', 'Ontwikkel emotionele intelligentie'],
      'ENTJ': ['Ontwikkel empathie', 'Wees geduldiger', 'Luister naar anderen', 'Zoek balans'],
      'ENTP': ['Focus op details', 'Voltooi projecten', 'Wees geduldiger', 'Ontwikkel structuur'],
      'INFJ': ['Deel je gevoelens', 'Wees minder perfectionistisch', 'Zoek praktische oplossingen', 'Ontwikkel assertiviteit'],
      'INFP': ['Wees praktischer', 'Deel je waarden', 'Ontwikkel structuur', 'Wees minder kritisch'],
      'ENFJ': ['Zorg voor jezelf', 'Wees minder perfectionistisch', 'Accepteer kritiek', 'Zoek balans'],
      'ENFP': ['Focus op details', 'Voltooi projecten', 'Ontwikkel structuur', 'Wees geduldiger'],
      'ISTJ': ['Wees flexibeler', 'Ontwikkel creativiteit', 'Deel je gevoelens', 'Zoek nieuwe ervaringen'],
      'ISFJ': ['Zorg voor jezelf', 'Wees assertiever', 'Ontwikkel creativiteit', 'Zoek nieuwe ervaringen'],
      'ESTJ': ['Ontwikkel empathie', 'Wees flexibeler', 'Luister naar anderen', 'Zoek creativiteit'],
      'ESFJ': ['Zorg voor jezelf', 'Wees minder perfectionistisch', 'Ontwikkel assertiviteit', 'Zoek nieuwe ervaringen'],
      'ISTP': ['Deel je gevoelens', 'Ontwikkel planning', 'Wees geduldiger', 'Zoek sociale verbinding'],
      'ISFP': ['Wees assertiever', 'Ontwikkel planning', 'Deel je waarden', 'Zoek nieuwe ervaringen'],
      'ESTP': ['Ontwikkel planning', 'Wees geduldiger', 'Luister naar anderen', 'Zoek diepte'],
      'ESFP': ['Focus op details', 'Ontwikkel planning', 'Wees geduldiger', 'Zoek diepte']
    };

    return recommendations[type] || [];
  }

  /**
   * Complete MBTI assessment and get results
   */
  async completeAssessment(): Promise<MBTIResult> {
    try {
      const score = this.calculateScore();
      const percentage = this.calculatePercentages(score);
      const type = this.determineType(score);
      
      const result: MBTIResult = {
        type,
        score,
        percentage,
        description: this.getTypeDescription(type),
        strengths: this.getTypeStrengths(type),
        challenges: this.getTypeChallenges(type),
        recommendations: this.getTypeRecommendations(type),
        timestamp: new Date()
      };

      // Save to database
      await this.saveResult(result);

      return result;
    } catch (error) {
      console.error('MBTI Service: Error completing assessment', error);
      throw error;
    }
  }

  /**
   * Save MBTI result to database
   */
  private async saveResult(result: MBTIResult): Promise<void> {
    try {
      await databaseV14.write(async () => {
        // This would save to your MBTI results table
        // For now, just log it
        console.log('MBTI Service: Saving result', result);
      });
    } catch (error) {
      console.error('MBTI Service: Error saving result', error);
      throw error;
    }
  }

  /**
   * Get MBTI result by type
   */
  async getResult(type: string): Promise<MBTIResult | null> {
    try {
      // This would fetch from your database
      // For now, return a mock result
      return {
        type,
        score: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
        percentage: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
        description: this.getTypeDescription(type),
        strengths: this.getTypeStrengths(type),
        challenges: this.getTypeChallenges(type),
        recommendations: this.getTypeRecommendations(type),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('MBTI Service: Error getting result', error);
      return null;
    }
  }

  /**
   * Reset assessment
   */
  resetAssessment(): void {
    this.answers = [];
  }

  /**
   * Get assessment progress
   */
  getProgress(): number {
    return Math.round((this.answers.length / this.questions.length) * 100);
  }
}

// Export singleton instance
export const mbtiService = new MBTIService();
