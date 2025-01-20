export function updateHasOwnProperty<T>(target: T, input: Partial<T>): T {
    Object.keys(input).forEach((key) => {
        if (input.hasOwnProperty(key)) {
            // @ts-ignore для доступа к ключу через строку
            target[key] = input[key];
        }
    });
    return target;
}
