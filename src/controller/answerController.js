import {AnswerStore} from '../store/answerStore.js'
import {Answer} from '../model/answer.js'

/**
 * This static class is in charge of the logic of control and processing of the data of the answers.
 */
export class AnswerController {

    /**
     * This static method is responsible for formatting the response data to print them on the console using the enquirer.js library.
     * @param {String} [questionId] iID of the question to which the answer belongs.
     * @returns {Object} Returns an object containing the index of the correct answer and an array with all the answers formatted.
     */
    static getAnswersForChoices = async (questionId = null) => {
        try {
            let answers = await AnswerStore.getAnswersByQuestion(questionId);
            const correctChoice = answers
                                    .find( answer => answer.getIsCorrect())
                                    .getId();
            
            const choices = answers.map( answer => ({
                    name: answer.getId(),
                    message: answer.getText(), 
                })
            );
            return {correctChoice, choices};
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is in charge of giving the store class of answer the order of saving in the database and of performing any adaptation or control over the data of answer if necessary.
     * @param {Object|Answer} answer This normal object or Answer class object contains the data required to store a answer in the database.
     * @returns {Boolean} Returns true if the operation was successful, otherwise it returns false.
     */
    static addAnswer = async (answer) => {
        try {
            if( !(answer instanceof Answer)){
                if(!Object.keys(answer).length) return false;
                answer = new Answer(answer.text, answer.question, answer.isCorrect);
            }
            return await AnswerStore.addAnswer(answer);
        } catch (error) {
            console.error(error);
            return false;
        }
    }


    /**
     * This method is responsible for validating the data to be deleted and giving the order to delete them if they are valid.
     * @param {Array<String>} questionIds This array contains the question IDs associated with the answers that will be removed.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static deleteAnswers = async (questionIds) => {
        try {
            if(!questionIds.length) return false;
            return await AnswerStore.deleteAnswer(questionIds);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

}