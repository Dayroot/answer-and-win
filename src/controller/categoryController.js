import {CategoryStore} from '../store/categoryStore.js';
import {Category} from '../model/Category.js';
import { LevelController } from './levelController.js';

/**
 * This static class is in charge of the logic of control and processing of the data of the Categories.
 */
export class CategoryController {

    /**
     * This method is responsible for formatting the data of all the categories that are in the database, giving them a configuration through which they can be used by the enqueruir.js library to print to the console.
     * @returns {Array<Object>} This array contains the category data in the format required by enquirer.js.
     */
    static getCategoriesForChoices = async () => {
        try {
            const allCategories = await CategoryStore.getAllCategories();
            return allCategories.map( category => ({
                    name: category.getId(),
                    message: category.getName(),
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for formatting the data of each category in the database in a format that can be used by the MenuView class to print to the console.
     * @returns {Array<Object>} Returns an array of objects with the data of each formatted category.
     */
    static getCategoriesForTable = async () => {
        try {
            const allCategories = await CategoryStore.getAllCategories();
            const promises = allCategories.map( async (category) => {
                const level = await LevelController.searchLevelById(category.getLevel());
                return {...category.getData(), level: level.getValue()};
            });
            return await Promise.all(promises);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for establishing the validation control of the data that will be added to the database.
     * @param {Object|Category} data This normal object or Category class object contains the data required to store a category in the database.
     * @returns {Boolean} Returns true if the operation was successful, otherwise it returns false.
     */
    static addCategory = async (category) => {
        try {
            if( !(category instanceof Category)){
                if(!Object.keys(category).length) return false;
                category = new Category(category.name, category.level);
            }
            return await CategoryStore.addCategory(category);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method is responsible for validating the identification of the category to search for, if it is true, it uses the method of the class in charge of managing the categories database to search for the specified category.
     * @param {String} categoryId category identification.
     * @returns {Category} Return an object of the Category class.
     */
    static searchCategoryById = async (categoryId) => {
        try {
            if(typeof categoryId !== 'string') return null;
            return await CategoryStore.getCategoryById(categoryId);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is in charge of validating the data of the categories entered to carry out the elimination operation, if they are valid, the method in charge of carrying out the action will be called.
     * @param {Array<String>} idsArray This array contains the IDs of the categories that will be removed.
     * @returns {Boolean} Returns true if the operation is correct, otherwise it returns false.
     */
    static deleteCategories = async (idsArray) => {
        try {
            if(!idsArray.length) return false;
            return await CategoryStore.deleteCategory(idsArray);
            
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This method is responsible for validating the condition under which the categories will be searched for in the database. If this is true, it will call the method in charge of managing the data in the DB.
     * @param {Number} levelId Level that the categories must have to fulfill the search.
     * @returns {Array<Category>} This array contains objects of class category whose level corresponds to the specified.
     */
    static searchCategoriesByLevel = async (levelId) => {
        try {
            if(typeof(levelId) !== 'string') return null;
            return await CategoryStore.getCategoriesByLevel(levelId);
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
                await this.addCategory(data.value);
            } else if ( data.operation === 'delete'){
                await this.deleteCategories(data.value);
            }   
            return 'back';
        } catch (error) {
            console.error(error);
        }
    };
}