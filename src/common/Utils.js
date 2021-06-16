class Utils {
    constructor() {

    }
    async waitFor(check, maxTry = 5, timeout = 200) {
        return new Promise((resolve) => {
            let tries = 0;
            let intr = setInterval(() => {
                console.log(`Waiting ${tries}`);
                if ((++tries == maxTry) || check()) {
                    clearInterval(intr)
                    resolve();
                }
            }, timeout);
        });
    }
}
module.exports = new Utils();