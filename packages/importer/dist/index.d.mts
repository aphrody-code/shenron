declare function isESM(): boolean;
declare function dirname(url: string): string;
declare function resolve(...paths: string[]): Promise<string[]>;
declare function importx(...paths: string[]): Promise<void>;

export { dirname, importx, isESM, resolve };
