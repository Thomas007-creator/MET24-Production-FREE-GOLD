export interface MBTIQuestion {
  id: number;
  text: string;
  dichotomy: 'I/E' | 'S/N' | 'T/F' | 'J/P';
  reversed: boolean;
}

export interface MBTIResult {
  letters: string;
  percentages: Record<
    string,
    {
      percentage: number;
      confidence: number;
      letter: string;
    }
  >;
  confidence: number;
}

export interface DichotomyItems {
  'I/E': number[];
  'S/N': number[];
  'T/F': number[];
  'J/P': number[];
}

export const dichotomyItems: DichotomyItems = {
  'I/E': [0, 4], // items 1, 5 (0-indexed)
  'S/N': [1, 5, 8], // items 2, 6, 9
  'T/F': [2, 6, 9], // items 3, 7, 10
  'J/P': [3, 7], // items 4, 8
};

export const questions: MBTIQuestion[] = [
  {
    id: 1,
    text: 'Ik laad het liefst op door alleen tijd door te brengen.',
    dichotomy: 'I/E',
    reversed: false,
  },
  {
    id: 2,
    text: 'Ik let meer op feiten en details dan op patronen en mogelijkheden.',
    dichotomy: 'S/N',
    reversed: true,
  },
  {
    id: 3,
    text: 'Beslissingen neem ik meestal op basis van logica in plaats van gevoel.',
    dichotomy: 'T/F',
    reversed: false,
  },
  {
    id: 4,
    text: 'Ik plan graag dingen en houd van structuur.',
    dichotomy: 'J/P',
    reversed: false,
  },
  {
    id: 5,
    text: 'Ik voel me energieker na het ontmoeten van nieuwe mensen.',
    dichotomy: 'I/E',
    reversed: true,
  },
  {
    id: 6,
    text: 'Ik vertrouw op intuïtie om toekomstmogelijkheden te zien.',
    dichotomy: 'S/N',
    reversed: false,
  },
  {
    id: 7,
    text: 'In discussies zoek ik naar de waarheid, zelfs als het ongemakkelijk is.',
    dichotomy: 'T/F',
    reversed: false,
  },
  {
    id: 8,
    text: 'Ik vind flexibiliteit en ruimte belangrijker dan strakke planning.',
    dichotomy: 'J/P',
    reversed: true,
  },
  {
    id: 9,
    text: 'Ik merk vaak details op die anderen missen.',
    dichotomy: 'S/N',
    reversed: true,
  },
  {
    id: 10,
    text: 'Ik stel mijn gevoelens en waarden mee laten wegen bij beslissingen.',
    dichotomy: 'T/F',
    reversed: true,
  },
];

/**
 * Maps answers from 1-5 scale to -2 to +2 scale
 */
export function mapAnswersToScale(answers: number[]): number[] {
  return answers.map(a => a - 3);
}

/**
 * Calculates MBTI result from answers array
 */
export function calculateMBTIResult(answers: number[]): MBTIResult {
  // Map answers 1-5 to -2..+2 around center
  const mappedAnswers = mapAnswersToScale(answers);

  const result: any = {};
  let letters = '';

  // Calculate scores for each dichotomy
  Object.entries(dichotomyItems).forEach(([dichotomy, itemIndices]) => {
    let sum = 0;
    const maxPossible = itemIndices.length * 2; // 2 points per item max

    itemIndices.forEach((itemIndex: number) => {
      const question = questions[itemIndex];
      let value = mappedAnswers[itemIndex];

      // Apply reversal if needed
      if (question.reversed) {
        value = -value;
      }

      sum += value;
    });

    // Calculate percentage (0-100 towards one pole)
    const percentage = 50 + (sum / maxPossible) * 50;

    // Determine letter
    const [left, right] = dichotomy.split('/');
    const letter = sum > 0 ? right : left;
    letters += letter;

    // Calculate confidence for this dichotomy
    const confidence = Math.min(100, (Math.abs(sum) / maxPossible) * 100);

    result[dichotomy] = {
      percentage: Math.round(percentage),
      confidence: Math.round(confidence),
      letter,
    };
  });

  // Overall confidence is average of individual confidences
  const overallConfidence = Math.round(
    Object.values(result).reduce(
      (sum: number, d: any) => sum + d.confidence,
      0
    ) / 4
  );

  return {
    letters,
    percentages: result,
    confidence: overallConfidence,
  };
}

/**
 * Validates if all questions are answered
 */
export function validateAnswers(answers: number[]): boolean {
  return !answers.some(a => a === 0);
}
