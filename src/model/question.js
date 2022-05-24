import { v4 as uuidv4} from 'uuid';

/**
 * Represents the model of a question, assigned to a corresponding category.
 */
export class Question {

    /**
     * @param {String} text Question content.
     * @param {String} category String with the id of the category to which the quesion belongs.
     * @param {String} [id] Question identification.
     */
    constructor(text, category, id = uuidv4() ){
        this.id = id;
        this.text = text;
        this.category = category;
    }

    /**
     * @returns {Object} Returns an object with all the properties of the question.
     */
    getData(){
        return {
            id: this.id,
            text: this.text,
            category: this.category
        }
    }

    /**
     * @returns {String} Returns a string that represents the question ID
     */
    getId(){
        return this.id;
    }

    /**
     * @returns {String} Returns a string with the content of the question
     */
    getText(){
        return this.text;
    }

    /**
     * This function allows to set the text of the question content.
     * @param {String} text Question content.
     */
    setText(text){
        this.text = text;
    }

    /**
     * @returns {String} Returns a string with the id of the category to which the question belongs.
     */
    getCategory(){
        return this.category;
    }

    /**
     * This function allows you to set the category of the question.
     * @param {String} category String with the id  of the category to which the question is assigned.
     */
    setCategory(category){
        this.category = category;
    }

}