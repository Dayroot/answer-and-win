import enquirerPkg from 'enquirer';
/**
 * This class allows you to print multiple views or display elements based on the enquirer.js library to the console. 
 * For example, you can combine a Confirm with a select, table, or any other display element.
 */
export class PromptView{
    content;
    result;
    /**
     * This object contains the necessary parameters for the construction of an object of the PromptView class.
     * @typedef {Object} PromptParams
     * @property {Array<Object>} content This array of objects contains all the settings for each of the visual elements that will be part of the prompt.
     * @property {Function} [result] This function is responsible for formatting the final result delivered by the prompt, so that it is properly processed by the controller.
     */

    /**
     * @param {PromptParams} params
     */
    constructor(params){
        this.content = params.content;
        this.result = params.result;
    }

    /** This object contains the formatted data of the result of the user's interaction with the graphical interface.
     * @typedef {Object} promptViewResult
     * @property {String} operation Represents the type of operation the controller performs on the data.
     * @property {Object} value This object contains the data of the result of the user's interaction with the view.
     */

    /**
     * 
     * @returns {promptViewResult}
     */
    async run(){
        const result = await enquirerPkg.prompt( this.content );
        return this.result ? await this.result(result) : result;
    }

}
