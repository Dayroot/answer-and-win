

/**
 * This function is responsible for converting a number expressed in milli to a unit with two decimal digits.
 * @param {Number} value Number value expressed in milli.
 * @returns {Number} Returns a number with two tenth digits.
 */
export  const fromMilitoUnit = (value) => {
    return +(Math.round(value/1000 + 'e+2') + 'e-2')
}

/**
     * This function generates a random number in the range of values that are passed to it as limits.
     * @param {Number} min Minimum range of the number that will be randomly generated.
     * @param {Number} max Maximum range of the number that will be randomly generated.
     * @returns {Number} Random number.
     */
export const getRandomNumber = (max, min = 0) => {
    try {
        return Math.floor( Math.random()*(max - min) + min);
    } catch (error) {
        console.error(error);
    }
}

/**
     * This function takes care of unordering the elements of an array following the fisher-yate algorithm.
     * @param {Array} array Array of elements.
     * @returns {Array} Returns an array of unordered elements.
     */
export const disorderArray = (array) => {
    const disorderArray = [...array];
    for(let i = disorderArray.length - 1; i > 0; i--){
        const j = Math.floor( Math.random()*(i + 1));
        [disorderArray[i], disorderArray[j]] = [disorderArray[j], disorderArray[i]];
    }
    return disorderArray;
};