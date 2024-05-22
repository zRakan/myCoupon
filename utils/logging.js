const NAME = 'myCoupon';

export function log(message) {
    console.log(`[${NAME}] ${message}`);
}

export function error(message) {
    console.error(`[${NAME}] Error: ${message}`);
}