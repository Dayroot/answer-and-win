import { v4 as uuidv4} from 'uuid';

/**
 * Represents the category model to which the questions are assigned.
 */
export class Category {
    id;
    name;
    level;

    /**
     * @param {String} name Category name.
     * @param {String} level Id of the level of difficulty that the category has.
     * @param {String} [id] Category identification.
     */
    constructor(name, level, id = uuidv4()){
        this.id = id;
        this.name = name;
        this.level = level;
    }

    /**
     * This function is responsible for returning all the data of the category
     * @returns {Object} Returns an object with the properties of the category.
     */
    getData(){
        return {
            id: this.id,
            name: this.name,
            level: this.level
        }
    }

    /**
     * @returns {String} Returns a string with the identification of the category.
     */
    getId(){
        return this.id;
    }

    /**
     * @returns {String} Returns a string with the name of the category.
     */
    getName(){
        return this.name;
    }

    /**
     * This function allows to set the name of the category.
     * @param {String} name Category name.
     */
    setName(name){
        this.name = name;
    }

    /**
     * @returns {String} Returns a string representing the id of the category level.
     */
    getLevel(){
        return this.level;
    }

    /**
     * This function allows you to set the level of the category.
     * @param {String} level Category level.
     */
    setLevel(level){
        this.level = level;
    }
}
