export const objectKeys = <T extends {}>(inputObject: T) => (Object.keys(inputObject) as (keyof typeof inputObject)[]);
