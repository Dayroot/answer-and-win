import enquirerPkg from 'enquirer';

/**
 * this class represents a menu in the application interface.
 */
export class MenuView {

    /**
     * This object contains all the parameters necessary for the construction of an object of the MenuView class.
     * @typedef {Object} menuParameters
     * @property {String} type  This property can only take a value from menu or submenu.
     * @property {String} message   This will be the text that the menu will show before printing the selection options.
     * @property {Array<String>} choices This array will contain all the selection options that the menu will show.
     */

    /**
     * @param {menuParameters} params 
     */
    constructor( params ){
        this.type = params.type || 'menu';
        this.message = params.message;
        this.choices = this._setChoicesFormat(params.choices);
        this.selectData = {
            header: `${"======================================".green}\n${
                "$$$$$$$$$$$".green
            } ${"Answer and Win".bold} ${"$$$$$$$$$$$".green}\n${
                "======================================".green
            }`,
            message: this.message,
            choices: this.choices,
            symbols: {
                prefix(state) {
                    return { pending: "→".green, cancelled: "x".red}[
                        state.status
                    ];
                },
            },
        };
    }

    /**
     * This function is responsible for formatting the menu options, for later use as parameters for the construction of objects in the enquirer library, it also adds an index for each of the options and includes some that will be by default depending on the type of menu.
     * @param {Array<String>} choices This array will contain the menu options that are formatted.
     * @returns {Array<Object>} Returns an array of objects, each one representing a formatted menu option.
     */
    _setChoicesFormat(choices) {
        try {
            let choicesFormat = choices.map( (choice, index) => {
                const number = index + 1;
                return {
                    name: number,
                    message: `${number.toString().green}. ${choice}`
                }
            });
            let defaultChoices = [
                {
                    role: 'separator',
                    message: '---------------------------------'
                },
                {
                    name: 'close',
                    message: `${'00'.toString().green}. Close`,
                }
            ];
            const backOption = {
                name: 'back',
                message: `${'0'.toString().green}. Back`,
            };

            if(this.type === 'submenu'){
                defaultChoices.splice(1, 0, backOption);
            }

            return choicesFormat.concat( defaultChoices );
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for executing the menu, to achieve this it uses an object of the "Select" class of the Enquirer library.
     * @returns {String} Returns the menu option that was selected.
     */
    async run(){
        try {
            const select = new enquirerPkg.Select(this.selectData);
            let result = await select.run();
            return result;

        } catch (error) {
            console.error(error);
        }
    }
}

