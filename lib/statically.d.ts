/// <reference types="node" />
declare module 'util' {
    function promisify<T>(func: (data: any, cb: (err: NodeJS.ErrnoException, data?: T) => void) => void): (...input: any[]) => Promise<T>;
}
export interface IUrl {
    url: string;
    dist_file: string;
}
export declare function generateSite(urls: Array<IUrl>): void;
export {};
