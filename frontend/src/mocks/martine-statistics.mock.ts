import {QuizStats} from "../models/quiz-stats.model";
import {QuestionStats} from "../models/question-stats.model";
import {QuestionType} from "../models/question-type.models";


export const QUESTIONSTAT1: QuestionStats = {
  questionId: "1",
  questionType: QuestionType.TextOnly,
  success: true,
  timeSpent: 2.2,
  answerHint: false
}

export const QUESTIONSTAT2: QuestionStats = {
  questionId: "2",
  questionType: QuestionType.TextOnly,
  success: true,
  timeSpent: 3.1,
  answerHint: false
}

export const QUESTIONSTAT3: QuestionStats = {
  questionId: "3",
  questionType: QuestionType.Sound,
  success: false,
  timeSpent: 5,
  answerHint: false
}

export const QUESTIONSTAT1TRY2: QuestionStats = {
  questionId: "1",
  questionType: QuestionType.TextOnly,
  success: false,
  timeSpent: 2,
  answerHint: false
}

export const QUESTIONSTAT2TRY2: QuestionStats = {
  questionId: "2",
  questionType: QuestionType.TextOnly,
  success: true,
  timeSpent: 2.8,
  answerHint: false
}

export const QUESTIONSTAT3TRY2: QuestionStats = {
  questionId: "3",
  questionType: QuestionType.Sound,
  success: true,
  timeSpent: 3,
  answerHint: false
}

export const MARTINE_QUIZTRY1: QuizStats = {
  userId: "134b849f-fd4b-4b13-b377-f283b117365d",
  quizId: "1",

  questionsStats: [QUESTIONSTAT1, QUESTIONSTAT2, QUESTIONSTAT3]
}

export const MARTINE_QUIZTRY2: QuizStats = {
  userId: "134b849f-fd4b-4b13-b377-f283b117365d",
  quizId: "1",

  questionsStats: [QUESTIONSTAT1TRY2, QUESTIONSTAT2TRY2, QUESTIONSTAT3TRY2]
}

export const MARTINE_QUIZSTAT2: QuizStats = {
  userId: "134b849f-fd4b-4b13-b377-f283b117365d",
  quizId: "2",

  questionsStats: [QUESTIONSTAT1, QUESTIONSTAT2]
}



