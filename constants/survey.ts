// Survey field length constants
export const SURVEY_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000, // Reasonable limit for TEXT field
  QUESTION_MAX_LENGTH: 1000, // Reasonable limit for questions
  COMMENTS_MAX_LENGTH: 2000, // Reasonable limit for comments
  MIN_DAYS_AFTER_HIRING: 0,
  MAX_DAYS_AFTER_HIRING: 365,
  MIN_SURVEY_DURATION: 1,
  MAX_SURVEY_DURATION: 180,
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 50
} as const;

export const SURVEY_VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'El título es requerido',
  TITLE_TOO_LONG: `El título no puede exceder ${SURVEY_LIMITS.TITLE_MAX_LENGTH} caracteres`,
  DESCRIPTION_TOO_LONG: `La descripción no puede exceder ${SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH} caracteres`,
  QUESTION_REQUIRED: 'La pregunta es requerida',
  QUESTION_TOO_LONG: `La pregunta no puede exceder ${SURVEY_LIMITS.QUESTION_MAX_LENGTH} caracteres`,
  COMMENTS_TOO_LONG: `Los comentarios no pueden exceder ${SURVEY_LIMITS.COMMENTS_MAX_LENGTH} caracteres`,
  DAYS_AFTER_HIRING_INVALID: `Los días después de contratación deben estar entre ${SURVEY_LIMITS.MIN_DAYS_AFTER_HIRING} y ${SURVEY_LIMITS.MAX_DAYS_AFTER_HIRING}`,
  SURVEY_DURATION_INVALID: `La duración de la encuesta debe estar entre ${SURVEY_LIMITS.MIN_SURVEY_DURATION} y ${SURVEY_LIMITS.MAX_SURVEY_DURATION} días`,
  MIN_QUESTIONS_REQUIRED: `Debe tener al menos ${SURVEY_LIMITS.MIN_QUESTIONS} pregunta`,
  MAX_QUESTIONS_EXCEEDED: `No puede tener más de ${SURVEY_LIMITS.MAX_QUESTIONS} preguntas`
} as const;