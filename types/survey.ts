export interface Survey {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  daysAfterHiring: number; // Days after hiring when survey becomes available
  surveyDuration: number; // How many days the survey stays available
  questions: SurveyQuestion[];
  responses?: SurveyResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  question: string;
  order: number;
  isRequired: boolean;
  answers?: SurveyAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  companyId: string;
  studentId: string;
  isCompleted: boolean;
  comments?: string;
  survey?: Survey;
  company?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name?: string;
    email?: string;
  };
  answers: SurveyAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  rating: number; // 0-5 rating
  question?: SurveyQuestion;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSurveyData {
  title: string;
  description?: string;
  daysAfterHiring: number;
  surveyDuration: number;
  questions: CreateSurveyQuestionData[];
}

export interface CreateSurveyQuestionData {
  question: string;
  order: number;
  isRequired?: boolean;
}

export interface SurveyFormData {
  answers: Record<string, number>; // questionId -> rating
  comments?: string;
}

export const RATING_LABELS = {
  5: 'Muy Bien',
  4: 'Bien', 
  3: 'Regular',
  2: 'Mal',
  1: 'Pésimo',
  0: 'No aplica'
} as const;

export type RatingValue = keyof typeof RATING_LABELS;