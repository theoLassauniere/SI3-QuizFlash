const { Attempts, QuestionStats, QuizStats, Question, Quiz } = require("../../models");
const ValidationError = require("../../utils/errors/validation-error");

const data = {
    try: userQuizzes => userQuizzes.sort((a, b) => b.date - a.date).map(stat => [stat.date.toString(), stat.questionsStats]),
    question: (userQuizzes, questionType) => Object.entries(getAccumulateQuestionStats(userQuizzes, questionType))
};

const dataValue = {
    success: value => getRateByFilter(value),
    time: value => average(value.flatMap(q => q.attempts.map(attempt => attempt.timeSpent))) ?? 0
};

const generalRates = {
    success: questionsStats => ({
        answerHintRate: getRateByFilter(questionsStats, question => question.attempts.some(attempt => attempt.answerHint)),
        successRate: getRateByFilter(questionsStats)
    }),
    time: questionsStats => {
        let timeSpent = questionsStats.flatMap(q => q.attempts.map(attempt => attempt.timeSpent));
        return { totalTime: sum(timeSpent), averageTime: average(timeSpent) ?? 0 };
    }
};

/**
 * Returns the data corresponding to the query with specific arguments
 * @param {string} dataType the data type (success/time)
 * @param {string} statType the stat filter (try/question)
 * @param {string} userId the user id
 * @param {string|undefined} quizId the quiz id
 * @param {string|undefined} questionType the question type
 * @return {{[p: string]: *}} an object with the requested data
 */

function getRequestedStat(dataType, statType, userId, quizId, questionType) {
    if (!data[statType])
        throw new ValidationError("Invalid statType");
    if (!generalRates[dataType])
        throw new ValidationError("Invalid dataType");

    const userQuizzes = buildUserStats(userId, quizId, questionType);
    let result = data[statType](userQuizzes, questionType);
    const rateData = generalRates[dataType](userQuizzes.flatMap(stat => stat.questionsStats));

    return {
        data: userQuizzes.length ? { dataType, ...rateData } : {},
        graphData: result.map(([key, value]) => ({
            key: key.toString(),
            value: dataValue[dataType](value.filter(questionStat => isQuestionOfType(questionStat.questionId, questionType)))
        }))
    };
}

/**
 * Returns the list of quizStats aggregated for a user
 * @param {string} userId the user id
 * @param {string|undefined} quizId the quiz id
 * @param {string|undefined} questionType the questionType
 * @return {(QuizStats&{id: string, questionsStats: *})[]} the corresponding QuizStats
 */
function buildUserStats(userId, quizId = undefined, questionType = undefined) {
    const userStats = QuizStats.get().filter(quizStat => quizStat.userId === userId
        && (!quizId || quizStat.quizId === quizId));
    return userStats.map(quizStat => buildStat(quizStat.id, questionType)).filter(stats => stats !== null);
}

/**
 * This function aggregates the questionStats and attempts from the
 * database to build the entire quizStats
 * @param {string} quizStatId
 * @param {string|undefined} questionType
 * @return {QuizStats&{id: string, questionsStats: *}}
 */
function buildStat(quizStatId, questionType) {
    const quizStat = QuizStats.getById(quizStatId);
    const questionsStats = getQuizStatQuestionStats(quizStatId, questionType).map(questionStats => {
        const attempts = getQuestionStatAttempts(questionStats.id);
        return { ...questionStats, attempts };
    });
    return !questionsStats.length ? null : { ...quizStat, questionsStats };
}

/**
 * This function gets all the questionsStats of a QuizStats
 * @param {string} quizStatId
 * @param {questionType|undefined} questionType
 * @return {QuestionStats&{id: string}[]}
 */
function getQuizStatQuestionStats(quizStatId, questionType) {
    return QuestionStats.get().filter(questionStat => questionStat.quizStatId === quizStatId &&
        isQuestionOfType(questionStat.questionId, questionType));
}

/**
 * This function gets all the attempts of a questionStat
 * @param {string} questionStatId
 * @return {Attempts&{id: string}[]}
 */
function getQuestionStatAttempts(questionStatId) {
    return Attempts.get().filter(attempt => attempt.questionStatId === questionStatId);
}

/*********
 * UTILS *
 *********/

function getRateByFilter(questionsStats, successFilter = question => question.success) {
    return average(questionsStats.map(question => successFilter(question) ? 100 : 0));
}

function getAccumulateQuestionStats(userQuizzes, questionType) {
    return userQuizzes.flatMap(quiz => quiz.questionsStats.filter(question => isQuestionOfType(question.questionId, questionType)))
        .reduce((groups, question) => {
            (groups[getQuestionStatText(question.questionId)] ||= []).push(question);
            return groups;
        }, {});
}

function sum(array) {
    return array.reduce((acc, c) => acc + c, 0);
}

function average(array) {
    return array.length === 0 ? undefined : sum(array) / array.length;
}

function isQuestionOfType(questionId, questionType) {
    const question = Question.get().find(question => question.id === questionId);
    return !questionType || (question && question.type === questionType);
}

/**
 * Return the title of the corresponding question
 * @param {string} questionId
 */
function getQuestionStatText(questionId) {
    return Question.get().find(question => question.id === questionId).text;
}

function getQuizzesParticipationIds(userId) {
    return [...new Set(QuizStats.get().filter(stat => stat.userId === userId).map(stat => stat.quizId))];
}

function getQuizTitle(quizId) {
    return Quiz.get().find(quiz => quiz.id === quizId).title;
}

/**
 * Returns the titles and ids of quizzes in which a user has taken part
 * @param {string} userId
 * @return {{id: string, title: string}[]} the ids and titles
 */
function getUserQuizzesParticipation(userId) {
    const quizIds = getQuizzesParticipationIds(userId);
    return quizIds.map(quizId => ({
        id: quizId,
        title: getQuizTitle(quizId)
    }));
}

module.exports = {
    buildUserStats,
    getRequestedStat,
    getUserQuizzesParticipation
};