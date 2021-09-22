export default function intersect<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    return arr1.filter(value => arr2.includes(value));
}
