import fs from 'fs';
import {Question} from '../model/question.js';

/**
 * This static class works as an intermediary between the questions database and the controller, allowing you to obtain and manipulate the data corresponding to the questions.
 */
export class QuestionStore{

    /**
     * Questions database address.
     */
    static _QUESTION_DB = "src/db/questionsDB.json";

    /**
     * Fetch all question records from the database.
     * @returns {Promise} Returns a promise that resolved an object with all registered questions.
     */
    static _getAllData = () => {
        return new Promise( (resolve, reject) => {
            fs.readFile(this._QUESTION_DB, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                const result = JSON.parse(data);
                resolve(result);
            });
        });
    }

    /**
     * This function is responsible for saving the data of the entered question in the database.
     * @param {Object} data Object with the data of a question.
     * @returns {Promise} Returns a promise that resolved to a boolean value of true if executed correctly.
     */
    static _save = (data) => {
        return new Promise( (resolve, reject) => {
            fs.writeFile(this._QUESTION_DB, JSON.stringify(data), {encoding: "utf8"}, (error) => {
                if(error){
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * This method is responsible for formatting the data in an object of the class question.
     * @param {Object} data Object containing all the attributes of an question to be modeled.
     * @param {String} id Question identification.
     * @returns {Question} Returns an object of the question class that models the data.
     */
    static _setModel = (data, id) => {
        const questionData = data[id];
        return new Question(questionData.text,  questionData.category, id);
    }

    /**
     * This function is responsible for bringing all the question records from the database and inserting the data of the new question in the object obtained, to later use the function (save) and perform its persistence.
     * @param {Object|Question} question The question argument can be an object with the question data or an object of the Question class.
     * @returns {Boolean} This function returns true if the question data is saved in the database correctly, otherwise it will return false.
     */
    static addQuestion = async (question) => {
        try {
            if( !(question instanceof Question)){
                question = new Question(question.text, question.category);
            }
            const data = await this._getAllData();
            const id = question.getId();
            if( data.hasOwnProperty(id) ) return true;
            const newQuestionData = question.getData();
            data[id] = delete newQuestionData.id && newQuestionData;
            const result = await this._save(data);
            return result && question;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This function is responsible for removing a question from the database.
     * @param {Question|String} question An object of class Question or a String with the id of the question.
     * @returns {Boolean} Returns true if the question was successfully removed, otherwise it returns false.
     */
    static deleteQuestion = async (question) =>{
        try {
            const data = await this._getAllData();
            const id =  question instanceof Question ? question.getId() : question;
            if(!data.hasOwnProperty(id)) return false;
            delete data[id];
            return await this._save(data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This function is responsible for obtaining from the database the question that is registered with the entered id.
     * @param {String} id The question id.
     * @returns {Question} Returns an object of class question.
     */
    static getQuestion = async (id) => {
        try {
            const data = await this._getAllData();
            if(!data.hasOwnProperty(id)) return ;
            return this._setModel(data, id);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for returning all the questions registered in the database.
     * @returns {Array<Question>} Returns an array with objects of the Question class, of all the questions registered in the database.
     */
    static getAllQuestions = async () => {
        try {
            const data = await this._getAllData();
            const allQuestions = [];
            for(const id in data){
                const question = this._setModel(data, id);
                allQuestions.push(question);
            }
            return allQuestions;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *  This method is responsible for searching the database for questions whose category matches the one entered as an argument.
     * @param {String} categoryId Question category identification
     * @returns {Array<Question>} Returns an array of objects of class question.
     */
    static getQuestionsByCategory = async (categoryId) => {
        try {
            const data = await this._getAllData();
            const questions = [];
            for(const id in data){
                if (data[id].category === categoryId) {
                    const question = this._setModel(data, id);
                    questions.push(question);
                }
            }
            return questions;
        
        } catch (error) {
            console.error(error);
        }
    }
}