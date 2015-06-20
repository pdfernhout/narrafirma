// Type definitions for Humane 3.0
// Project: http://wavded.github.com/humane-js/
// Definitions by: jmvrbanac <https://github.com/jmvrbanac>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface HumaneOptions {
    queue?: string[];
    baseCls?: string;
    addnCls?: string;
    timeout?: number;
    waitForMove?: boolean;
    clickToClose?: boolean;
    forceNew?: boolean;
}

interface Humane {
    queue: string[];
    baseCls: string;
    addnCls: string;
    timeout: number;
    waitForMove: boolean;
    clickToClose: boolean;
    forceNew: boolean;

    create(options?: HumaneOptions): Humane;
    info: Function;
    error: Function;
    spawn(options: HumaneOptions): Function;
    remove(any): void;
    log(message: string): Humane;
    log(message: string, callback: Function): Humane;
    log(message: string, options: HumaneOptions): Humane;
    log(message: string, callback: Function, options: HumaneOptions): Humane;

    log(listOfMessages: any[]): Humane;
}

declare var humane: Humane;

// Made into a module by Paul Fernhout below
// declare module humane {
    // export function remove(e);
    // export function log(html: string, o: any, cb?: Function, defaults?: any): any;
    // export function spawn(defaults?: any);
    // export function create(o?: any): any;
// }

declare module "humane" {
    export = humane;
}
