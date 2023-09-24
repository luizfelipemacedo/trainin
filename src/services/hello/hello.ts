function getHelloMessage(ip: string): string {
    return `Hello from ${ip}!`;
}

export const helloService = Object.freeze({
    getHelloMessage
});