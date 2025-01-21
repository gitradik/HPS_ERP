export function updateExistingFields<T extends { dataValues: Record<string, any> }>(
  target: T,
  input: Partial<T['dataValues']>,
): T {
  // Get only keys from dataValues
  const validKeys = Object.keys(target.dataValues) as (keyof T['dataValues'])[];

  Object.keys(input).forEach((key) => {
    if (validKeys.includes(key as keyof T['dataValues'])) {
      // @ts-ignore
      target[key] = input[key];
    }
  });

  return target;
}
