import fs from 'fs';
import {Category} from '../model/category.js';

/**
 * This static class works as an intermediary between the categories database and the controller, allowing you to obtain and manipulate the data corresponding to the categories.
 */
export class CategoryStore{
    /**
     * Categories database address.
     */
    static _CATEGORY_DB = "src/db/categoriesDB.json";

    /**
     * Fetch all category records from the database.
     * @returns {Promise} Returns a promise that resolved an object with all registered categories.
     */
    static _getAllData = () =>{
        return new Promise( (resolve, reject) => {
            fs.readFile(this._CATEGORY_DB, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                const result = JSON.parse(data);
                resolve(result);
            });
        });
    }

    /**
     * This function is responsible for saving the data of the entered category in the database.
     * @param {Object} data Object with the data of a category.
     * @returns {Promise} Returns a promise that resolved to a boolean value of true if executed correctly.
     */
    static _save = (data) => {
        return new Promise( (resolve, reject) => {
            fs.writeFile(this._CATEGORY_DB, JSON.stringify(data), {encoding: "utf8"}, (error) => {
                if(error){
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * This method is responsible for formatting the data in an object of the class category.
     * @param {Object} data Object containing all the attributes of an category to be modeled.
     * @param {String} id category identification.
     * @returns {Category} Returns an object of the category class that models the data.
     */
    static _setModel = (data, id) => {
        const categoryData = data[id];
        return new Category(categoryData.name, categoryData.level, id);
    }

    /**
     * This function is responsible for bringing all the category records from the database and inserting the data of the new category in the object obtained, to later use the function (save) and perform its persistence.
     * @param {Object|Category} category The category argument can be an object with the category data or an object of the Category class.
     * @returns {Boolean} This function returns true if the category data is saved in the database correctly, otherwise it will return false.
     */
    static addCategory = async (category) => {
        try {
            const data = await this._getAllData();
            const id = category.getId();
            if( data.hasOwnProperty(id) ) return true;
            const newCategoryData = category.getData();
            data[id] = delete newCategoryData.id && newCategoryData;
            const result = await this._save(data);
            return result;

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This function is responsible for removing a category from the database.
     * @param {Array<String>} category This array contains all the IDs of the categories that will be removed
     * @returns {Boolean} Returns true if the category was successfully removed, otherwise it returns false.
     */
    static deleteCategory = async (idsArray) => {
        try {
            const data =  await this._getAllData();
            for(const id of idsArray){
                data[id] && delete data[id];
            }
            return  await this._save(data);
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    /**
     * This function is responsible for obtaining from the database the category that is registered with the entered id.
     * @param {String} id The category id.
     * @returns {Category} Returns an object of class category.
     */
    static getCategoryById = async (id) =>{
        try {
            const data = await this._getAllData();
            if(!data.hasOwnProperty(id)) return ;
            return this._setModel(data, id);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This function is responsible for returning all the categories registered in the database.
     * @returns {Array<Category>} Returns an array with objects of the Category class, of all the categories registered in the database.
     */
    static getAllCategories = async () => {
        try {
            const data = await this._getAllData();
            const allCategories = [];
            for(const id in data){
                const category = this._setModel(data, id);
                allCategories.push(category);
            }
            return allCategories;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * This method is responsible for returning all the categories of the database whose level is equal to the one entered as an argument.
     * @param {String} levelId Category level identification.
     * @returns {Array<Category>} Returns an array with objects of class category.
     */
    static getCategoriesByLevel = async (levelId) => {
        try {
            const data = await this._getAllData();
            const categories = [];
            for(const id in data){
                if(data[id].level === levelId){
                    const category = this._setModel(data, id);
                    categories.push(category);
                }
            }
            return categories;
        } catch (error) {
            console.error(error);
        }
    };
}