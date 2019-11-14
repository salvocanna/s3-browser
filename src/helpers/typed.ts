export const objectKeys = <T extends {}>(inputObject: T) => (Object.keys(inputObject) as (keyof typeof inputObject)[]);

// Phew! I made it! 🎉
// I'm surprised TS doesn't actually have this in the lib
// Makes all the keys of T optional, except for the specified ones as required.
export type WithOnlyRequired<T, K extends keyof T> = Partial<T> & { [P in K]-?: T[P] };
