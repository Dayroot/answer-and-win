import 'colors';
import {InterfaceView} from './view/interfaceView.js';

/**
 * The main function is responsible for executing the application.
 */
async function main () {
    try {
        InterfaceView.run();
    } catch (error) {
        console.error(error);
    }
}

main();