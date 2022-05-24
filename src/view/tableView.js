import enquirerPkg from 'enquirer';

/**
 * This class represents a table whose purpose is to allow the data to be represented graphically in the console so that the user can interact with it. If the multiple attribute is true, the user will be able to select one or more elements of the table using the space key and will be able to confirm the selection with the enter key.
 */
export class TableView extends enquirerPkg.Select {


    /**
     * This object contains all the parameters necessary for the construction of an object of the TableView class.
     * @typedef {Object} tableParams 
     * @property {String} title  Table title.
     * @property {Array<String>} columns  This array contains the names of the columns of the table. They must match the properties of the objects that contain the data in the rows.olumn names.
     * @property {Number} columnWidth Maximum width that each column of the table will have.
     * @property {Array<Object>} rows This array contains objects with the data of each row, its properties have the same name as the columns.
     * @property {function} result This function is responsible for formatting the result obtained from the user's interaction with the table.
     * @property {Boolean} multiple if it is true, the table allows selecting multiple elements, if it is false, the elements cannot be selected. Default is false.
     * @property {Array<String>} actions This array contains all the actions that the user can perform with the records of the table, however its role is only representative and is linked to the result format.
     */

    /**
     * 
     * @param {tableParams} params 
     */
    constructor(params) {
        super({
            name: "table",
            message: params.rows.length ? params.title : 'Sorry, no record found.',
            multiple: params.multiple,
            result: function (value) {
                if(this.defaultActions.includes(this.focused.name)) return this.focused.name;
                return this.customResult ? this.customResult(value) : value;
            }
        });
        this.columns = params.columns,
        this.columnWidth = params.columnWidth || 30;
        this.defaultActions = ['back', 'close'];
        this.actions = (params.actions || []).concat(this.defaultActions);
        this.options.choices =  this._setRowsFormat( params.rows);
        this.customResult = params.result || null;
        this.rows = params.rows;
        
    }


    /**
     * This method is responsible for formatting the header of the table in an object that has the necessary properties to be printed on the console by using the enquirer.js library.
     * @returns {Object} Returns an object that contains the necessary properties to print the table header on the console.
     */
    _setHeadTableFormat() {
        try {
            const separatorSize = this.columnWidth * this.columns.length;
            let headTable = `\b\b${'-'.repeat(separatorSize + 2)}\n  `;
            this.columns.forEach(column => {
                const gapSize = this.columnWidth - column.length;
                headTable += `${column.bold}${' '.repeat(gapSize)}`;
            });
            headTable += `\n${'-'.repeat(separatorSize + 2)}`;
            return {
                role: 'separator',
                message: headTable.white,
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is responsible for formatting in a valid configuration, the actions that the user can perform when interacting with the table in the console.
     * @returns {Array<Object>} Returns an array of objects with each of the actions formatted.
     */
    _setFooterTable(){
        try {
            const separatorSize = this.columnWidth * this.columns.length;
            const footer = [{role:'separator', message:'\b\b'+'-'.repeat(separatorSize + 2).white}];
            for (const action of this.actions){
                footer.push({name: action, message: action});
            }
            return footer;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * This method is responsible for formatting the row data in a valid configuration by the enquirer.js library, which will be responsible for printing each row of the table on the screen.
     * @param {Array<Object>} rows This array contains objects whose properties are the values that will be printed in each row of the table.
     * @returns {Array<Object>} Returns an array of objects with the data of each row formatted.
     */
    _setRowsFormat(rows) {
        try {
            let rowsFormat = [];
            if(rows.length) {
                rowsFormat = rows.map( data => {
                    let message = '';
                    this.columns.forEach(column => {
                        const gapSize = this.columnWidth - data[column].toString().length
                        message += `${data[column]}${' '.repeat(gapSize)}`;
                    }); 
                    return {
                        name: data.id,
                        message: message,
                    };
                });
                rowsFormat.unshift(this._setHeadTableFormat());
            }
            return rowsFormat.concat(this._setFooterTable());
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Sets the symbol that is printed on the console before the title of the table, and the figure that it will have depending on the selection state of the records in case the multiple property is true.
     */
    symbols = {
        prefix(state) {
            const enabled = state._choices.some( choice => choice.enabled);
            return enabled ? '⦿  '.green : '⊙  '.grey;
        },
    }
    
    /**
     * This method is responsible for giving styles to the text of the row of the table or action on which the pointer is positioned.
     * @param {Object} choice Record row and action on which the pointer is positioned.
     * @param {Number} i Index of the position in which the pointer is, varies according to the user's interaction with the table.
     * @returns {String} Text with styles of the row and record on which the pointer is positioned.
     */
    choiceMessage(choice, i) {
        if(this.actions.includes(choice.name)) return choice.message.white;
        return this.index === i ? choice.message.bold.bgGreen : choice.message.grey;
    }

    /**
     * This method is responsible for removing the symbol that separates the title of the table and the content.
     * @returns {String} Return an empty string.
     */
    separator() {
        return '';
    }

    /**
     * This method is responsible for establishing the symbol that the pointer will have depending on whether it is on an action option or on a table row.
     * @param {Object} choice Record row and action on which the pointer is positioned.
     * @param {*} i Index of the position in which the pointer is, varies according to the user's interaction with the table.
     * @returns {String} This string contains the symbol that represents the pointer
     */
    pointer(choice, i) {
        if(this.state.multiple &&  !this.actions.includes(choice.name) ){
            return '';
        }
        return this.state.index === i ? '→'.green : ' ';
    }

    /**
     * This method is responsible for establishing the symbol that each row of the table or action option will have before its respective text.
     * @param {Object} choice Record row and action on which the pointer is positioned.
     * @returns {String} Returns a string with the symbol.
     */
    indicator(choice) {
        if(this.state.multiple ) {
            if(this.actions.includes(choice.name)) return '';
            else {
                if (choice.enabled) return '✓'.green;
                return '✓'.grey;
            }
        }
        return '';
    }

    /**
     * this method is responsible for delivering or returning the result of the user's interaction with the table when he presses the enter key, however this function limits this interaction and will only be carried out if the user presses the enter key on some of the action options.
     */
    submit() {
        if( !this.actions.includes(this.focused.name) ) return;
        return super.submit();
    }

    /**
     * This method is responsible for validating that at least one row has been selected when the user tries to select an action option other than the default ones.
     * @param {Array<String>} value In case the multiple property is true, this array will contain all the values of the table rows that have been checked, otherwise the array will contain the name of the action that was selected.
     * @returns {Boolean} Returns true if it meets the validation, otherwise it returns false.
     */
    validate(value) {
        if(this.options.multiple && !this.defaultActions.includes(this.focused.name) && !value.length) return false;
        return true;
    }

}

