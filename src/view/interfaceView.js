import enquirerPkg from 'enquirer';

//Controllers
import {InterfaceController} from '../controller/interfaceController.js';
import {CategoryController} from '../controller/categoryController.js';
import {QuestionController} from '../controller/questionController.js';
import {LevelController} from '../controller/levelController.js';
import {GameController} from '../controller/gameController.js';
import {PlayerController} from '../controller/playerController.js';

//Views
import {TableView} from './tableView.js';
import {MenuView} from './menuView.js'
import {PromptView} from './promptView.js';


/**
 * This class represents the interface of the application, its function is to establish the components in charge of printing the content in the console so that the user can interact and organize them in a tree shaped structure within an object, so that the controller can execute them. This class is static, so you don't need instantiate it to use it.
 */
export class InterfaceView {

    /**
     * This function is in charge of creating the necessary components for the execution of the interface in the console.
     * @returns {Object} Returns an object that contains all the components that were created.
     */
    static createComponents = () => {

        try {
            const mainMenuView = () => new MenuView({
                type: 'menu',
                message:"Select one of the following options", 
                choices: ['Play Now', 'Setting', 'Player History']
            });
    
            const settingMenuView = () => new MenuView({
                type: 'submenu',
                message:"Select one of the following options", 
                choices: ['Category', 'Question', 'level']
            });
    
            const CategorySettingMenuView = () => new MenuView({
                type: 'submenu',
                message:"Select one of the following options", 
                choices: ['Create Category', 'Delete Category']
            });

            const QuestionSettingMenuView = () => new MenuView({
                type: 'submenu',
                message:"Select one of the following options", 
                choices: ['Create Question', 'Delete Question']
            });

            const LevelSettingMenuView = () => new MenuView({
                type: 'submenu',
                message:"Select one of the following options", 
                choices: ['Create Level', 'Delete Level']
            });
    
            const categoryFormView = async () => {
                const levelsChoices = await LevelController.getLevelsForChoices();
                return new PromptView({
                    result: function(value){
                        return {
                            operation: 'add',
                            value
                        }
                    },
                    content: [
                        {
                            type: "input",
                            name: "name",
                            initial: "",
                            message: "Enter category name: ",
                            validate: function (value, data){
                                return Boolean(value);
                            },
                            symbols: {
                                prefix(state) {
                                    return state.input ? '⦿  '.green : '⊙  '.grey;
                                },
                            },
                            separator() {
                                return '';
                            },
                        },
                        {
                            type:"multiselect",
                            name: "level",
                            message: `Select the level of difficulty:\n${'(Use <space> to select, <enter> to accept)'.grey}`,
                            choices: levelsChoices,
                            maxSelected: 1,
                            result(id) {
                                return id[0];
                            },
                            validate(value){
                                return Boolean(value.length);
                            },
                            symbols: {
                                prefix(state) {
                                    const enabled = state._choices.some( choice => choice.enabled);
                                    return enabled ? '⦿  '.green : '⊙  '.grey;
                                },
                            },
                            separator() {
                                return '';
                            },
                        },
                    ]
                });
            };  

            const questionFormView = async () => {
                const categoriesChoices = await CategoryController.getCategoriesForChoices();
                return new PromptView({
                    result: function (value) {
                        return {
                            operation: "add",
                            value,
                        };
                    },
                    content: [
                        {
                            type: "input",
                            name: "text",
                            message: "Enter question text: ",
                            validate: function (value, data) {
                                return Boolean(value);
                            },
                            separator() {
                                return '';
                            },
                        },
                        {
                            type: "form",
                            name: "answers",
                            message: "Each question consists of a text and 4 answer options, where only one of them is valid. ",
                            validate: function (value, data) {
                                for(const key in value){
                                    if(!value[key]) return false;
                                }
                                return true;
                            },
                            choices: [
                                {name:'correctAnswer', message:'Correct option'},
                                {name:'answer2', message:'Wrong choice 1'},
                                {name:'answer3', message:'Wrong choice 2'},
                                {name:'answer4', message:'Wrong choice 3'},
                            ]
                        },
                        {
                            type:"multiselect",
                            name: "category",
                            message: `Select a category:\n${'(Use <space> to select, <enter> to accept)'.grey}`,
                            choices: categoriesChoices,
                            maxSelected: 1,
                            result(id) {
                                return id[0];
                            },
                            validate(value){
                                return Boolean(value.length);
                            },
                            separator() {
                                return '';
                            },
                        },
                    ],
                });
            };

            const levelFormView = async () => { 
                const levels = await LevelController.getLevelsString();
                return new enquirerPkg.Form({
                    message: `To create a new level, fill in the following fields:\n${("(levels already created → " + levels + ")").grey}\n`,
                    choices:[
                        {name:'value', message:`Difficulty level`, required: true, type:'Number'},
                        {name:'prize', message:'Prize in dollars', required: true, type:'Number'}
                    ],
                    result: function (value) {
                        return {
                            operation: "add",
                            value,
                        };
                    },
                    validate: function(value, data) {
                        for(const choice of data.choices){
                            if(choice.required && !choice.input) return false;
                            if(choice.type === 'Number' && isNaN(choice.input)) return false;
                            if (levels.includes(choice.input + ':')) return false;
                        }
                        return true;
                    }
            
                });
            };

            const deleteCategoriesTableView = async () => {
                const allCategoriesData = await CategoryController.getCategoriesForTable();
                return new TableView({
                    title: `Select the categories you want to remove:\n${'(Use <space> to select, <enter> to accept)'.grey}\n`,
                    rows: allCategoriesData,
                    columns: ['name', 'level'],
                    columnWidth: 40,
                    multiple: true,
                    actions: ['delete'],
                    result: function(value){
                        return {
                            operation: 'delete',
                            value
                        }
                    },
                });
            };

            const deleteQuestionsTableView = async () => {
                const allQuestionsData = await QuestionController.getQuestionsForTable();
                return new TableView({
                    title: `Select the questions you want to remove:\n${'(Use <space> to select, <enter> to accept)'.grey}\n`,
                    rows: allQuestionsData,
                    columns: ['text', 'category'],
                    columnWidth: 80,
                    multiple: true,
                    actions: ['delete'],
                    result: function(value){
                        return {
                            operation: 'delete',
                            value
                        }
                    },
                });
            };

            const deleteLevelsTableView = async () => {
                const allLevelsData = await LevelController.getLevelsForTable();
                return new TableView({
                    title: `Select the levels you want to remove\n${'(Use <space> to select, <enter> to accept)'.grey}\n`,
                    rows: allLevelsData,
                    columns: ['level', 'prize'],
                    columnWidth: 30,
                    multiple: true,
                    actions: ['delete'],
                    result: function(value){
                        return {
                            operation: 'delete',
                            value
                        }
                    },
                    
                });
            };

            const playerHistoryTableView = async () => {
                const allPlayersData = await PlayerController.getPlayersForTable();
                return new TableView({
                    title: ` ${'Player Ranking'.bold.grey.bgGreen}\n${'(Use <enter> to accept)'.grey}\n`,
                    rows: allPlayersData,
                    columns: ['username', 'level', 'time'],
                    columnWidth: 30,
                    multiple: false,
                });
                
            };

            const gameStartView = async () => new enquirerPkg.Toggle({
                message: `${'Welcome to answer and win!'.green}, the game consists of 5 rounds of questions,\neach with a prize that accumulates as you win each round. \n\nAre you ready ?`,
                enabled: `Start Game`.green,
                disabled: `Back to menu`.red,
                symbols: {
                    prefix(state) {
                        return { pending: "→".green, cancelled: "x".red}[
                            state.status
                        ];
                    },
                }
            });

            return {
                mainMenuView,
                settingMenuView,
                CategorySettingMenuView,
                QuestionSettingMenuView,
                LevelSettingMenuView,
                categoryFormView,
                questionFormView,
                levelFormView,
                deleteCategoriesTableView,
                deleteQuestionsTableView,
                deleteLevelsTableView,
                gameStartView,
                playerHistoryTableView
            };
            
        } catch (error) {
            console.error(error);
        }
    };

    /**
     *  This function is responsible for establishing the tree structure that the interface will have.
     * @param {Object} components Object with all interface components.
     * @returns {Object} Returns an object with the structure of the interface, where the view properties refer to a component that can be executed and the listed properties are the options or that this component will have.
     */
    static setInterfaceStructure = (components) => {
        try {
            return {
                view: components.mainMenuView,
                1: {
                    view: components.gameStartView,
                    controller: GameController,
                },
                2: {
                    view: components.settingMenuView,
                    1: {
                        view: components.CategorySettingMenuView,
                        1:{
                            view: components.categoryFormView,
                            controller: CategoryController,
                        },
                        2:{
                            view: components.deleteCategoriesTableView,
                            controller: CategoryController,
                        }
                    },
                    2: {
                        view: components.QuestionSettingMenuView,
                        1: {
                            view: components.questionFormView,
                            controller: QuestionController,
                        },
                        2: {
                            view: components.deleteQuestionsTableView,
                            controller: QuestionController,
                        }
                    },
                    3: {
                        view: components.LevelSettingMenuView,
                        1: {
                            view: components.levelFormView,
                            controller: LevelController,
                        },
                        2: {
                            view: components.deleteLevelsTableView,
                            controller: LevelController,
                        }
                    }
                },
                3: {
                    view: components.playerHistoryTableView,
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    
    /**
     * This function is responsible for launching the application interface.
     */
    static run = async () => {
        try {
            const components = this.createComponents();
            const structure = this.setInterfaceStructure(components);
            const interfaceController = new InterfaceController(structure);
            await interfaceController.start();
        } catch (error) {
            console.error(error);
        }
    };
}