import {QuestionStore} from '../store/questionStore.js';
import {AnswerController} from './answerController.js'
import { CategoryController } from './categoryController.js';
import {Question} from '../model/question.js';
/**
 * This static class is in charge of the logic of control and processing of the data of the questions.
 */
export class QuestionController {

    /**
     * This method is in charge of formatting the data of all the categories of the database, so that they can be used by the TableView class.
     * @returns {Array<Object>} Returns an array of objects with the data of each of the categories formatted.
     */
    static getQuestionsForTable = async () => {
        try {
            const allQuestions = await QuestionStore.getAllQuestions();
            const promises = allQuestions.map(async (question) => {
                const category = await CategoryController.searchCategoryById(question.getCategory());
                return {
                    id: question.getId(),
                    text: question.getText(),
                    category: category.getName(),
                };
            });
            return await Promise.all(promises);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is in charge of validating the data of the question that will be stored in the database, if this is fulfilled, it will invoke the class in charge of managing the question database and will carry out the necessary action.
     * @param {Object} data Object with the data of the question.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static addQuestion = async (data) => {
        try {
            if(!data.text || !data.category) return false;
            const newQuestion = new Question(data.text, data.category);
            const resultAddQuestion = await QuestionStore.addQuestion(newQuestion);
            let resultAddAnswers;
            for(const key in data.answers){
                const isCorrect = key === 'correctAnswer';
                resultAddAnswers = await AnswerController.addAnswer({
                    text: data.answers[key],
                    question: newQuestion.getId(),
                    isCorrect,
                });
            }
            return resultAddQuestion && resultAddAnswers;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This method is in charge of validating the identifications of the questions that will be eliminated, if this is true, it invokes the method of the class in charge of managing the questions database. In addition, the answers controller method is called to remove the answers associated with each of the question ids.
     * @param {Array<String>} idsArray Array with id's of all questions to delete.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false. 
     */
    static deleteQuestions = async (idsArray) => {
        try {
            if(!idsArray.length) return false;
            return  await QuestionStore.deleteQuestion(idsArray) && await AnswerController.deleteAnswers(idsArray);

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This method is in charge of validating the identification of the category entered as a parameter under which the search for the questions that belong to it will be carried out, if this is fulfilled it invokes the method of the class in charge of managing the database of the questions.
     * @param {String} categoryId Identification of the category to which the questions to be searched belong.
     * @returns {Array<Question>|null} returns an array of objects of the Question class, or null if the entered category is not valid.
     */
    static searchQuestionsByCategory = async (categoryId) => {
        try {
            if(typeof categoryId !== 'string') return null;
            return await QuestionStore.getQuestionsByCategory(categoryId);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for managing the action that is requested through the input parameter.
     * @param {Object} data This object contains an "operation" attribute that defines the type of action to be carried out by the controller, and a second attribute that contains the data necessary to perform said operation.
     * @returns {String} Returns a string with the value of "back" so that the controller returns to the view of the menu in the console.
     */
    static process = async (data) => {
        try {
            if(data === 'back' || data === 'close') return data;
            if(data.operation === 'add'){
                await this.addQuestion(data.value);
            } else if ( data.operation === 'delete'){
                await this.deleteQuestions(data.value);
            }   
            return 'back';
        } catch (error) {
            console.error(error);
        }
    }
}