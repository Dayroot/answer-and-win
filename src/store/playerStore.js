import fs from 'fs';
import {Player} from '../model/player.js';

/**
 * This static class works as an intermediary between the players database and the controller, allowing you to obtain and manipulate the data corresponding to the players.
 */
export class PlayerStore {
    /**
     * Players database address.
     */
    static _PLAYERS_DB = "src/db/playersDB.json";

    /**
     * Fetch all player records from the database.
     * @returns {Promise} Returns a promise that resolved an object with all registered players.
     */
    static _getAllData = () => {
        return new Promise( (resolve, reject) => {
            fs.readFile(this._PLAYERS_DB, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                const result = JSON.parse(data);
                resolve(result);
            });
        });
    }

    /**
     * This function is responsible for saving the data of the entered player in the database.
     * @param {Object} data Object with the data of a player.
     * @returns {Promise} Returns a promise that resolved to a boolean value of true if executed correctly.
     */
    static _save = (data) => {
        return new Promise( (resolve, reject) => {
            fs.writeFile(this._PLAYERS_DB, JSON.stringify(data), {encoding: "utf8"}, (error) => {
                if(error){
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * This method is responsible for formatting the data in an object of the class player.
     * @param {Object} data Object containing all the attributes of an player to be modeled.
     * @param {String} id level identification.
     * @returns {Level} Returns an object of the player class that models the data.
     */
    static _setModel = (data, id) => {
        return new Player(data.username,  Number(data.maxLevelReached), data.time, id);
    }

    /**
     * This function is responsible for bringing all the player records from the database and inserting the data of the new player in the object obtained, to later use the function (save) and perform its persistence.
     * @param {Player} player The player argument is an object of the player class.
     * @returns {Boolean} This function returns true if the player data is saved in the database correctly, otherwise it will return false.
     */
    static addPlayer = async (player) => {
        try {
            const data = await this._getAllData();
            const newPlayerData = player.getData();
            const id = newPlayerData.id;
            data[id] = delete newPlayerData.id && newPlayerData;
            return await this._save(data);

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This function is responsible for returning all the lplayers registered in the database.
     * @returns {Array<Player>} Returns an array with objects of the Player class, of all the players registered in the database.
     */
    static getAllPlayers = async () =>{
        try {
            const data = await this._getAllData();
            const allPlayers = [];
            for(const id in data){
                const player = this._setModel(data[id], id);
                allPlayers.push(player);
            }
            return allPlayers;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is responsible for updating the data of a player in the database.
     * @param {Player} player The player argument is an object of the player class.
     * @returns {Boolean} Returns true if the player data is updated correctly, otherwise returns false.
     */
    static updatePlayerData = async (player) => {
        try {
            const data = await this._getAllData();
            const playerData = player.getData();
            for(const id in data){
                if(playerData.id === id){
                    delete playerData.id
                    data[id] = playerData;
                    return await this._save(data);
                }
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * This method is in charge of looking for the record of a player in the database and returning it.
     * @param {String} username name with which the player record is searched for in the database.
     * @returns {Player|null} Returns an object of the Player class or null in case of not finding a record with the specified username.
     */
    static getPlayerByUsername = async (username) => {
        try {
            const data = await this._getAllData();
            for(const id in data){
                if(data[id].username === username){
                    return this._setModel(data[id], id);
                }
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}