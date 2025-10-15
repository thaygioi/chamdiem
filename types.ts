
export interface ResultDetail {
  questionNumber: number;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface GradingResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  gradePercentage: number;
  feedback: string;
  results: ResultDetail[];
}

export interface ImagePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}