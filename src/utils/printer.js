
/**
 * Represents the printing of decorative elements for the application interface.
 */
export class Printer {
    /**
     * Print the name of the aplication in a decorative way for the interface.
     */
    static printLogo = async () => {
        console.clear();
        console.log('======================'.green);
        console.log(`${'$$$'.green} ${'Answer and Win'.bold} ${'$$$'.green}`)
        console.log('======================'.green);
    }
}