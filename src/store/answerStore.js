import fs from 'fs';
import {Answer} from '../model/answer.js';

/**
 * This static class works as an intermediary between the answers database and the controller, allowing you to obtain and manipulate the data corresponding to the answers.
 */
export class AnswerStore{

    /**
     * Answers database address.
     */
    static _ANSWERS_DB = "src/db/answersDB.json";

    /**
     * Fetch all answer records from the database.
     * @returns {Promise} Returns a promise that resolved an object with all registered answers.
     */
    static _getAllData = () => {
        return new Promise( (resolve, reject) => {
            fs.readFile(this._ANSWERS_DB, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                const result = JSON.parse(data);
                resolve(result);
            });
        });
    }

    /**
     * This function is responsible for saving the data of the entered answer in the database.
     * @param {Object} data Object with the data of a answer.
     * @returns {Promise} Returns a promise that resolved to a boolean value of true if executed correctly.
     */
    static _save = (data) => {
        return new Promise( (resolve, reject) => {
            fs.writeFile(this._ANSWERS_DB, JSON.stringify(data), {encoding: "utf8"}, (error) => {
                if(error){
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * This method is responsible for formatting the data of a question in an object of the Answer class.
     * @param {Object} data Object containing all the attributes of an answer to be modeled.
     * @param {String} id Answer identification.
     * @returns {Answer} Returns an object of the answer class that models the data.
     */
    static _setModel = (data, id) =>{
        try {
            const answerData = data[id];
            return new Answer(answerData.text, answerData.question, answerData.isCorrect, id);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for bringing all the answer records from the database and inserting the data of the new answer in the object obtained, to later use the function (save) and perform its persistence.
     * @param {Object|Answer} answer The answer argument can be an object with the answer data or an object of the Answer class.
     * @returns {Boolean} This function returns true if the answer data is saved in the database correctly, otherwise it will return false.
     */
    static addAnswer = async (answer) =>{
        try {
            const data = await this._getAllData();
            const id = answer.getId();
            if( data.hasOwnProperty(id) ) return true;
            const newAnswerData = answer.getData();
            data[id] = delete newAnswerData.id && newAnswerData;
            const result = await this._save(data);
            return result;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This method is responsible for removing from the database all the answers associated with the question id received as a parameter.
     * @param {Array<String>} questionIds This array contains the question IDs associated with the answers that will be removed.
     * @returns {Boolean} Returns true if all answers was successfully removed, otherwise it returns false.
     */
    static deleteAnswer = async (questionIds) => {
        try {
            const data = await this._getAllData();
            for(const id in data){
                questionIds.includes(data[id].question) && delete data[id];
            }
            return await this._save(data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }


    /**
     * This function is responsible for obtaining from the database the answer that is registered with the entered id.
     * @param {String} id The answer id.
     * @returns {Answer} Returns an object of class answer.
     */
    static getAnswer = async (id) => {
        try {
            const data = await this._getAllData();
            if(!data.hasOwnProperty(id)) return null;
            return this._setModel(data, id);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for returning all the answers registered in the database.
     * @returns {Array<Answer>} Returns an array with objects of the Answer class, of all the answers registered in the database.
     */
    static getAllAnswers = async () => {
        try {
            const data = await this._getAllData();
            const allAnswers = [];
            for(const id in data){
                const answer = this._setModel(data, id);
                allAnswers.push(answer);
            }
            return allAnswers;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for returning all the answers that are assigned to the ID of the entered question.
     * @param {String} questionId Identification of the question to which an answer is assigned.
     * @returns {Array<Answer>}
     */
    static getAnswersByQuestion = async (questionId) =>{
        try {
            const data = await this._getAllData();
            const answers = [];
            for(const id in data){
                if(data[id].question === questionId){
                    const answer = this._setModel(data, id);
                    answers.push(answer);
                }
            }
            return answers;
        } catch (error) {
            console.error(error);
        }
    }
}