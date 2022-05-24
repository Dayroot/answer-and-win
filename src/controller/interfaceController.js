import enquirerPkg from 'enquirer';

/**
 * This class represents the interface controller, its function is to execute the estructure of the menu tree with which the interface is built.
 */
export class InterfaceController{

    /**
     * @param {Object} structure This object contains the menu tree structure with each of its components.
     */
    constructor(structure){
        this.treeStructureMenu = structure;
    }

    /**
     * This function is responsible for traversing an objet that represents the structure of an interface through recursion. For each execution, it runs a "Prompt" object and performs an action depending on the result it returns.
     * @param {Object} interfaceObj This object contains a structureof the application interface.
     * @returns {Boolean} This returned value indicates whether the value of the previous interface should be re-executed or else it should be exited.
     */
    _run = async (interfaceObj) => {
        try {
            let close = false;
            while ( !close ){
                console.clear();
                const view = await interfaceObj.view();
                const result = await view.run();
                const choice = interfaceObj.controller ? await interfaceObj.controller.process(result) : result;
                if(choice in interfaceObj){
                    close = await this._run(interfaceObj[choice]);
                } 
                else if (choice === 'close') {
                    const confirmView = new enquirerPkg.Toggle({
                        name: 'confirm',
                        message: 'Are you sure you want to close application?',
                        enabled: 'Close'.red,
                        disabled: 'Back'.green,
                    });
                    console.clear();
                    const confirm = await confirmView.run();
                    close = confirm;
                } else if (choice === 'back') { 
                    break;
                }
            }
            return close;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This function is responsible for starting the controller.
     */
    start = async () => {
        try {
            await this._run(this.treeStructureMenu);
        } catch (error) {
            console.error(error);
        }
    }
}
