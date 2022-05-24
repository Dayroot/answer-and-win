import { v4 as uuidv4} from 'uuid';

/**
 * This class represents a player of the game.
 */
export class Player {
    /**
     * @param {String} username Name used in the game by the user.
     * @param {Number} maxLevelReached The maximum level the player reached in-game.
     * @param {Number} time Total time it took the player to answer all the questions.
     */
    constructor(username, maxLevelReached, time, id = uuidv4()){
        this.id = id;
        this.username = username;
        this.maxLevelReached = maxLevelReached;
        this.time = time;
    }

    /**
     * @returns {Object} Returns an object with all the properties of the player.
     */
    getData(){
        return {
            id: this.id,
            username: this.username,
            maxLevelReached: this.maxLevelReached,
            time: this.time,
        }
    }

    /**
     * @returns {String} return the username.
     */
    getUsername(){
        return this.username;
    }

    /**
     * This method sets the username of the player.
     * @param {String} username 
     */
    setUsername(username){
        this.username = username;
    }

    /**
     * This method establishes the maximum level that the player reached during the game.
     * @param {Number} level 
     */
    setmaxLevelReached(level){
        this.maxLevelReached = level;
    }

    /**
     * This method sets the player's game time.
     * @param {Number} time 
     */
    setTime(time){
        this.time = time;
    }
}