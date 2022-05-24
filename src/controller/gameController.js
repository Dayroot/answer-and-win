import enquirerPkg from 'enquirer';
import { RoundController } from '../controller/roundController.js';
import { LevelController } from './levelController.js';
import { PlayerController } from './playerController.js';

/**
 * This static class allows to establish the logical control of the game through its methods.
 */
export class GameController {
    /**
     * Name or alias of the user who is playing
     */
    static _username;

    /**
     * This method is responsible for using the enquirer.js library to print an input on the console for the user to enter the username with which they want to be identified and registered in the game history.
     * @returns {String} Returns the username entered by the user;
     */
    static _askUsername = async () => {
        const result = await enquirerPkg.prompt({
            type: 'input',
            name: 'username',
            mesage: `Enter a username ${'(maximum 8 characters)'.grey}:`,
            symbols: {
                prefix(state) {
                    return state.input ? '⦿  '.green : '⊙  '.grey;
                },
            },
            validate(value){
                return value.length < 8;
            },
            separator(){
                return '';
            }
        });
        return result.username;
    };  

    /**
     * This method is responsible for recording the user's game data.
     * @param {String} username Name with which the user identifies.
     * @param {Number} maxLevel maximum level of the game reached by the user.
     * @returns {Boolean} Returns true if the operation is successful, otherwise returns false.
     */
    static _registerPlayerData = async (username, maxLevel, time) => {
        return await PlayerController.registerPlayer({username: username, maxLevelReached: maxLevel, time: time});
    }

    /**
     * This method is responsible for executing each of the rounds of the game and analyzing its result to determine if it advances to the next level or if not, the game ends. If the player wins the round, the prize obtained is accumulated and the next level of difficulty is progressively passed, otherwise, the user's data will be saved and the execution will exit.
     * @param {Number} levelValue Game difficulty level.
     * @param {Number} accumulated Accumulated value of the prizes obtained in each round of the game.
     */
    static _run = async (levelValue = 1, accumulated = 0, time = 0) => {

        const level = await LevelController.searchLevelByValue(levelValue);
        console.clear();
        const result = await RoundController.startRound(levelValue);
        console.clear();
        time += result.round.time;
        let confirmConfig;
        let params = [];
        let gameOver = false;
        if(result.round.correct){
            accumulated +=  level.getPrize(); 
            const nextLevelValue = levelValue + 1;

            if(nextLevelValue === 6) {
                confirmConfig = {
                    message: `${"Congratulations!".bold.bgGreen.grey} you have answered all the questions correctly. You won 🎉 ${("$" +accumulated).yellow} 🎉\n\n`,
                    enabled: 'Play again'.green,
                    disabled: 'Back to menu'.red,
                    symbols: {
                        prefix(state) {
                            return { pending: "🏆".green}[
                                state.status
                            ];
                        },
                    }
                };
                gameOver = true;
            }
            else {
                confirmConfig = {
                    message: `${"You're right!".bold.bgGreen.gray} each time you are closer to the great final prize,\nso far you have accumulated ${("$" + accumulated).yellow}.\n\n${"If You leave the game now, you will be able to take what you have accumulated,\nbut you will lose the chance to get a better prize.".grey}\n\n`,
                    enabled: 'Continue playing'.green,
                    disabled: 'Quit the game'.red,
                    symbols: {
                        prefix(state) {
                            return { pending: "✓".green}[
                                state.status
                            ];
                        },
                    }
                };
                params = [nextLevelValue, accumulated, time];
            }
        } else {
            confirmConfig = {
                message: `${"You lost!".bold.bgRed.gray} You managed to reach level ${levelValue.toString().yellow}.\n${"The game is over, but you could try again!".grey}\n\n`,
                enabled: 'Play again'.green,
                disabled: 'Back to menu'.red,
                symbols: {
                    prefix(state) {
                        return { pending: "​❌​"}[
                            state.status
                        ];
                    },
                }
            };
            gameOver = true;
        }
        const confirm = await new enquirerPkg.Toggle(confirmConfig);
        const decision = await confirm.run();
        if(gameOver | !decision){ 
            await this._registerPlayerData(this._username, levelValue, time);
        }
        if( decision ) await this._run(...params);
    }

    /**
     * This method is responsible for executing the game as indicated by the received parameter.
     * @param {Boolean} start Boolean value that sets the start of the game.
     * @returns {String} Returns a string with the value of "back" so that the controller returns to the view of the menu in the console.
     */
    static process = async (start) => {
        if( start ){
            this._username = await this._askUsername();
            await this._run();
            this._username = null;
        }
        return 'back';
    }
}