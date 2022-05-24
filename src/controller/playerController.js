import {PlayerStore} from '../store/playerStore.js'
import {Player} from '../model/player.js';
import {fromMilitoUnit} from '../utils/utils.js'

/**
 * This static class handles the player's data processing and control logic.
 */
export class PlayerController {

    /**
     * This method is responsible for validating the player class object that will be added to the database. If this is true, it calls the method responsible for managing the player database.
     * @param {Object|Player} player This object can be of the Player class or a normal object, it must contain all the necessary attributes for the correct persistence of the data.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static addPlayer = async (player) => {
        try {
            if( !(player instanceof Player)){
                player = new Player(player.username,  Number(player.maxLevelReached), fromMilitoUnit(player.time));
            }
            return await PlayerStore.addPlayer(player);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method is responsible for registering a user according to whether they already have a record in the database or not, if the first case occurs, the data will be updated, otherwise the new player will be registered.
     * @param {Object} data This object contains all the attributes necessary for the construction of an object of the Player class.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static registerPlayer = async (data) => {
        try {
            if(!Object.keys(data).length) return false;
            const player = await PlayerStore.getPlayerByUsername(data.username);
            if(player) {
                player.setUsername(data.username);
                player.setmaxLevelReached(data.maxLevelReached);
                player.setTime(data.time);
                return await PlayerStore.updatePlayerData(player);
            }
            else return await this.addPlayer(data);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method is responsible for ordering the players' records according to the level reached and the time it took them.
     * @param {Array<Object>} players Array with objects containing all player data.
     * @returns {Array<Object>} Array with objects of the sorted.
     */
    static _orderPlayers = (players) => {
        return players.sort((player1,player2) => {
            return player1.level === player2.level 
                    ? player1.time - player2.time 
                    : player2.level - player1.level;
        });
    };

    /**
     * This method is responsible for formatting the data of all players that are in the database, so that they can be printed on the console using the enquirer.js library.
     * @returns {Array<Object>} Returns an array with the data of all the formatted players.
     */
    static getPlayersForTable = async () => {
        try {
            let allPlayers = await PlayerStore.getAllPlayers();
            allPlayers = allPlayers.map( player => {
                const data = player.getData();
                return {
                    id: data.id,
                    username: data.username,
                    level: data.maxLevelReached,
                    time: data.time,
                }
            });
            return this._orderPlayers(allPlayers);
        } catch (error) {
            console.error(error);
        }
    };
}