import { v4 as uuidv4} from 'uuid';

/**
 * This class represents the level of difficulty that each category of questions in the game will have.
 */
export class Level {
    id;
    value;
    prize;

    /**
     * @param {Number} value This number represents the difficulty level value of the game.
     * @param {Number} prize The prize value that the game level will have represented in dollars.
     * @param {String} [id] Game level identification.
     */
    constructor(value, prize, id = uuidv4()) {
        this.id = id;
        this.value = value;
        this.prize = prize;
    }

    /**
     * @returns {Object} Returns an object with all the attributes of the level.
     */
    getData() {
        return {
            id: this.id,
            value: this.value,
            prize: this.prize,
        };
    }

    /**
     * @returns {String} Returns a string that represents the level ID.
     */
    getId() {
        return this.id;
    }

    /**
     * @returns {Number} Returns a Number with the value of the level.
     */
    getValue() {
        return this.value;
    }

    /**
     * @returns {Number} Returns a Number with the prize of the level.
     */
    getPrize() {
        return this.prize;
    }
}