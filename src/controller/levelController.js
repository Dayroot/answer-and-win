import {LevelStore} from '../store/levelStore.js'
import {Level} from '../model/level.js';

/**
 * This static class is in charge of the logic of control and processing of the data of the game levels.
 */
export class LevelController {

    /**
     * This method is responsible for formatting each level with its prize in a string.
     * @returns {String} Returns a string with each of the levels and their respective prize.
     */
    static getLevelsString = async () => {
        const levels = await LevelStore.getAllLevels();
        return levels
                    .map(level => `${level.getValue()}: ${level.getPrize()}`)
                    .join(' | ');
    };

    /**
     * This method is responsible for formatting the data of all the levels that are in the database, giving them a configuration through which they can be used by the enqueruir.js library to print to the console.
     * @returns {Array<Object>} returns an array of objects, where each one represents a level of the game.
     */
    static getLevelsForChoices = async () => {
        try {
            const allLevels = await LevelStore.getAllLevels();
            return allLevels.map( level => ({
                    name: level.getId(),
                    message: level.getValue(),
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for formatting the data of all levels that are in the database, so that they can be printed on the console using the enquirer.js library.
     * @returns {Array<Object>} Returns an array with the data of all the formatted levels.
     */
    static getLevelsForTable = async () => {
        try {
            const allLevels = await LevelStore.getAllLevels();
            return allLevels.map( level => {
                const data = level.getData();
                return {
                    id: data.id,
                    level: data.value,
                    prize: data.prize,
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for validating the level class object that will be added to the database. If this is true, it calls the method responsible for managing the level database.
     * @param {Object|Level} level This object can be of the Level class or a normal object, it must contain all the necessary attributes for the correct persistence of the data.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static addLevel = async (level) => {
        try {
            if( !(level instanceof Level)){
                if(!Object.keys(level).length) return false;
                level = new Level(Number(level.value), Number(level.prize));
            }
            return await LevelStore.addLevel(level);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method is in charge of validating the identifications of the levels to be eliminated, if this is true, it calls the method in charge of managing the levels database.
     * @param {Array<String>} idsArray Array with the IDs of the levels to remove.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static deleteLevels = async (idsArray) => {
        try {
            if(!idsArray.length) return false;
            return await LevelStore.deleteLevel(idsArray);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method allows you to search for a level according to its identification, it is in charge of validating the identification received as a parameter and then it calls the class in charge of managing the data of the levels in the database.
     * @param {String} levelId Identification of the level to search.
     * @returns {Level} returns an object of class level.
     */
    static searchLevelById = async (levelId) => {
        try {
            if(typeof(levelId) !== 'string') return null;
            return await LevelStore.getLevel(levelId);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method allows you to search for a level according to its value, it is in charge of validating the received parameter and then it calls the class in charge of managing the data of the levels in the database.
     * @param {Number} levelValue Level value to find.
     * @returns {Level|null} Returns the level that matches the provided id or null if not found.
     */
    static searchLevelByValue = async (levelValue) => {
        try {
            if(isNaN(levelValue)) return null;
            return await LevelStore.getLevelByValue(levelValue);
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
                await this.addLevel(data.value);
            } else if ( data.operation === 'delete'){
                await this.deleteLevels(data.value);
            }   
            return 'back';
        } catch (error) {
            console.error(error);
        }
    }
}