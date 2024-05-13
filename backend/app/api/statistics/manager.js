const { Attempts, QuestionStats, QuizStats, Question } = require("../../models");
const BadStatFilterError = require("../../utils/errors/bad-statfilter-error");
const BadDataTypeError = require("../../utils/errors/bad-datatype-error");

/**
 * Returns the data corresponding to the query with specific arguments
 * @param dataType the data type (success/time)
 * @param statFilter the stat filter (try/question)
 * @param userId the user id
 * @param quizId the quiz id
 * @param questionType the question type
 * @return {[number[],number[]]}
 */
function getRequestedStat(dataType, statFilter, userId, quizId, questionType) {
    const statFunctions = {
        success: {
            try: getSuccessRatePerTry,
            question: getSuccessRatePerQuestion
        },
        time: {
            try: getTimePerTry,
            question: getTimePerQuestion
        }
    };
    const functions = statFunctions[dataType];
    if (functions) {
        if (functions[statFilter])
            return functions[statFilter](userId, quizId, questionType);
        else
            throw new BadStatFilterError("Invalid statFilter");
    } else
        throw new BadDataTypeError("Invalid dataType");
}

/**
 * Returns the list of quizStats aggregated for a user
 * @param userId the user id
 * @return {[]} the corresponding QuizStats
 */
function buildUserStats(userId) {
    const parsedId = parseInt(userId, 10);
    const userStats = QuizStats.get().filter(quizStat => quizStat.userId === parsedId);
    return userStats.map(quizStat => buildStat(quizStat.id));
}

/**
 * This function aggregates the questionStats and attempts from the
 * database to build the entire quizStats
 * @param quizStatId
 * @return {*&{questionsStats: *}}
 */
function buildStat(quizStatId) {
    const quizStat = QuizStats.getById(quizStatId);
    const questionsStats = getQuizStatQuestionStats(quizStatId).map(questionStats => {
        const attempts = getQuestionStatAttempts(questionStats.id);
        return { ...questionStats, attempts };
    });
    return { ...quizStat, questionsStats };
}

/**
 * This function gets all the questionsStats of a QuizStats
 * @param quizStatId
 */
function getQuizStatQuestionStats(quizStatId) {
    const parsedId = parseInt(quizStatId, 10);
    return QuestionStats.get().filter(questionStat => questionStat.quizStatId === parsedId);
}

/**
 * This function gets all the attempts of a questionStat
 * @param questionStatId
 */
function getQuestionStatAttempts(questionStatId) {
    const parsedId = parseInt(questionStatId, 10);
    return Attempts.get().filter(attempt => attempt.questionStatId === parsedId);
}

/*****************
 * STATISTICS *
 * ****************/

function getSuccessRatePerTry(userId, quizId, questionType) {
    const userStats = getUserQuizzes(userId, questionType, quizId);
    return [userStats.map(stat => stat.quizId), userStats.map(stat => getRateByFilter([stat], questionType))];
}

function getSuccessRatePerQuestion(userId, quizId, questionType) {
    let result = getAccumulateQuestionStats(userId, quizId, questionType);
    return [objectIntKeys(result), Object.values(result).map(question => questionSuccessRate(question) ?? 0)];
}

function getTimePerQuestion(userId, quizId, questionType) {
    let result = getAccumulateQuestionStats(userId, quizId, questionType);
    return [objectIntKeys(result), Object.values(result).map(question => average(question.flatMap(q => q.attempts.map(attempt => attempt.timeSpent))) ?? 0)];
}

function getTimePerTry(userId, quizId, questionType) {
    const userStats = getUserQuizzes(userId, questionType, quizId);
    return [userStats.map(stat => stat.quizId), userStats.map(stat => sum(stat.questionsStats.flatMap(q => q.attempts.map(attempt => attempt.timeSpent))))];
}

function getRateByFilter(stats, questionType, successFilter = question => question.success) {
    let result = average(stats.flatMap(quiz => quiz.questionsStats
        .filter(questionStat => isQuestionOfType(questionStat, questionType))
        .map(question => successFilter(question) ? 1 : 0)));
    return result !== undefined ? result * 100 : -1;
}

function getUserQuizzes(userId, questionType, quizId) {
    return buildUserStats(userId).filter(stat => (!quizId || stat.quizId === parseInt(quizId, 10))
        && (!questionType || stat.questionsStats.some(question => isQuestionOfType(question, questionType))));
}

/*********
 * UTILS *
 *********/

function questionSuccessRate(questionStats) {
    let result = average(questionStats.map(question => question.success ? 1 : 0));
    return result ? result * 100 : undefined;
}


function getAccumulateQuestionStats(userId, quizId, questionType) {
    return getUserQuizzes(userId, questionType, quizId)
        .flatMap(quiz => quiz.questionsStats.filter(question => isQuestionOfType(question, questionType)))
        .reduce((groups, question) => {
            (groups[question.questionId] ||= []).push(question);
            return groups;
        }, {});
}

function sum(array) {
    return array.reduce((acc, c) => acc + c, 0);
}

function average(array) {
    return array.length === 0 ? undefined : sum(array) / array.length;
}

function isQuestionOfType(questionStat, questionType) {
    const question = Question.get().find(question => question.id === questionStat.questionId);
    return !questionType || (question && question.type === questionType);
}

function objectIntKeys(object) {
    return Object.keys(object).map(k => parseInt(k, 10));
}

module.exports = {
    buildUserStats,
    getRequestedStat
};