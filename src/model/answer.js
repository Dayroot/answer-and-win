import { v4 as uuidv4} from 'uuid';

/**
 * This class represents an answer choice for a question in the game.
 */
export class Answer {

    /**
     * @param {String} text Response content text
     * @param {String} question Question to which the answer corresponds.
     * @param {Boolean} isCorrect Indicates whether the answer to the question is a true or false option.
     * @param {String} [id] Response identification.
     */
    constructor(text, question, isCorrect, id=uuidv4()){
        this.id = id;
        this.text = text;
        this.question = question;
        this.isCorrect = isCorrect;
    }

    /**
     * @returns {Object} Returns an object with all the properties of the answer.
     */
    getData() {
        return {
            id: this.id,
            text: this.text,
            question: this.question,
            isCorrect: this.isCorrect,
        };
    }
    /**
     * @returns {String} Returns a string that represents the answer ID.
     */
    getId() {
        return this.id;
    }

    /**
     * @returns {String} Returns a String with the text content of the answer.
     */
    getText() {
        return this.text;
    }

    /**
     * @returns {String} Returns a string with the id of the question to which the answer corresponds.
     */
    getQuestion() {
        return this.question;
    }

    /**
     * @returns {Boolean} Returns true if the question is correct, otherwise returns false.
     */
    getIsCorrect() {
        return this.isCorrect;
    }
}