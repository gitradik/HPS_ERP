export const isConflictingField = (conflictingFields: Array<string>, fieldName: string) => {
  return conflictingFields.includes(fieldName);
};
