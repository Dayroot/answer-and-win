import fs from 'fs';
import {Level} from '../model/level.js';

/**
 * This static class works as an intermediary between the levels database and the controller, allowing you to obtain and manipulate the data corresponding to the levels.
 */
export class LevelStore {
    /**
     * Levels database address.
     */
    static _LEVELS_DB = "src/db/levelsDB.json";

    /**
     * Fetch all level records from the database.
     * @returns {Promise} Returns a promise that resolved an object with all registered levels.
     */
    static _getAllData = () => {
        return new Promise( (resolve, reject) => {
            fs.readFile(this._LEVELS_DB, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                const result = JSON.parse(data);
                resolve(result);
            });
        });
    }

    /**
     * This function is responsible for saving the data of the entered level in the database.
     * @param {Object} data Object with the data of a level.
     * @returns {Promise} Returns a promise that resolved to a boolean value of true if executed correctly.
     */
    static _save = (data) => {
        return new Promise( (resolve, reject) => {
            fs.writeFile(this._LEVELS_DB, JSON.stringify(data), {encoding: "utf8"}, (error) => {
                if(error){
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * This method is responsible for formatting the data in an object of the class Level.
     * @param {Object} data Object containing all the attributes of an level to be modeled.
     * @param {String} id level identification.
     * @returns {Level} Returns an object of the level class that models the data.
     */
    static _setModel = (data, id) => {
        const levelData = data[id];
        return new Level(Number(levelData.value),  Number(levelData.prize), id);
    }

    /**
     * This function is responsible for bringing all the level records from the database and inserting the data of the new level in the object obtained, to later use the function (save) and perform its persistence.
     * @param {Object|Level} level The level argument can be an object with the level data or an object of the Level class.
     * @returns {Boolean} This function returns true if the level data is saved in the database correctly, otherwise it will return false.
     */
    static addLevel = async (level) => {
        try {
            const data = await this._getAllData();
            const id = level.getId();
            if( data.hasOwnProperty(id) ) return true;
            const newLevelData = level.getData();
            data[id] = delete newLevelData.id && newLevelData;
            const result = await this._save(data);
            return result;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This function is responsible for removing a level from the database.
     * @param {Level|String} idsArray An object of class Level or a String with the id of the level.
     * @returns {Boolean} Returns true if the level was successfully removed, otherwise it returns false.
     */
    static deleteLevel = async (idsArray) => {
        try {
            const data = await this._getAllData();
            for(const id of idsArray){
                data[id] && delete data[id];
            }
            return await this._save(data);
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This function is responsible for obtaining from the database the level that is registered with the entered id.
     * @param {String} id The level id.
     * @returns {Level|null} Returns an object of class level, or null if not found.
     */
    static getLevel = async (id)  => {
        try {
            const data = await this._getAllData();
            if(!data.hasOwnProperty(id)) return null;
            return this._setModel(data, id);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for returning all the levels registered in the database.
     * @returns {Array<Level>} Returns an array with objects of the Level class, of all the levels registered in the database.
     */
    static getAllLevels = async () =>{
        try {
            const data = await this._getAllData();
            const allLevels = [];
            for(const id in data){
                const level = this._setModel(data, id);
                allLevels.push(level);
            }
            return allLevels;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is responsible for searching the database for the requested level and returning it.
     * @param {Number} value This integer represents the value of the difficulty level.
     * @returns {Level|null} Returns the level that matches the provided id or null if not found.
     */
    static getLevelByValue = async (value) => {
        try {
            const data = await this._getAllData();
            for (const id in data) {
                if (Number(data[id].value) === value) {
                    return this._setModel(data, id);
                }
            }
            return null;
        } catch (error) {
            console.error(error)
        }
    }
}