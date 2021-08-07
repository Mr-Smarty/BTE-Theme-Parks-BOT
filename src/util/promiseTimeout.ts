export default function promiseTimeout<T>(
    callback: (...args: any[]) => T,
    ms?: number
): Promise<T> {
    return new Promise(async (resolve, reject) => {
        await timeout(ms);
        resolve(callback());
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
