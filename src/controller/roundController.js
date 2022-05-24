import enquirerPkg from 'enquirer';
import {AnswerController} from '../controller/answerController.js';
import { CategoryController } from './categoryController.js';
import { QuestionController } from './questionController.js';
import { LevelController } from './levelController.js';
import {getRandomNumber, disorderArray} from '../utils/utils.js';

/**
 * This static class represents a round of the game, the usefulness of its main methods consists of setting a random question with its respective answer, and printing it on the console so that the user can interact and generate a choice.
 */
export class RoundController {


    /**
     * This method is responsible for randomly selecting a category of the indicated level.
     * @param {Number} levelValue Level of the category to be selected.
     * @returns {Category} Returns an object of class category.
     */
    static _getRandomCategory = async (levelValue) => {
        try {
            const level = await LevelController.searchLevelByValue(levelValue);
            const categories = await CategoryController.searchCategoriesByLevel(level.getId());
            return categories[getRandomNumber(categories.length)];
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for selecting a question at random that belongs to the specified category.
     * @param {String} categoryId ID of the category to which the question to be selected belongs.
     * @returns {Question} Returns an object of class Question.
     */
    static _getRandomQuestion = async (categoryId) => {
        try {
            const questions = await QuestionController.searchQuestionsByCategory(categoryId);
            return questions[getRandomNumber(questions.length)];
        } catch (error) {
            console.error(error);
        }
    };


    /**
     * This method is in charge of returning the responses associated with the identification of the question received as a parameter in an unordered manner, so that they are used in the game.
     * @param {String} questionId Identification of the question to which the answers to be obtained are associated.
     * @returns {Array<Answer>} Returns an array of objects of class answer.
     */
    static _getAnswerChoices = async (questionId) => {
        try {
            const answers = await AnswerController.getAnswersForChoices(questionId);
            answers.choices = disorderArray(answers.choices);
            return  answers;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This main method is responsible for obtaining a category randomly according to the game level specified for the round, in addition to a random question and its respective answers, where only one of the four is correct. It uses the prompt class of the enquirer.js library to print the question on the console so that the user can interact with it.
     * @param {Number} level Level of the category that the round of the game will have.
     * @returns {Boolean} Return true if the user guessed right, otherwise return false.
     */
    static startRound = async (level) => {
        try {
            const category = await this._getRandomCategory(level);
            const randomQuestion = await this._getRandomQuestion(category.getId());
            const answers = await this._getAnswerChoices(randomQuestion.getId());
            const startTime = Date.now();
            return await enquirerPkg.prompt({
                type:'select',
                name: `round`,
                message: `${randomQuestion.getText()}?`,
                choices: answers.choices,
                correctChoice: answers.correctChoice,
                result(value){
                    const endTime = Date.now();
                    return {
                        correct: value === this.correctChoice,
                        time: endTime - startTime,
                    };
                }
            });
        } catch (error) {
            console.error(error);
        }
    };
}