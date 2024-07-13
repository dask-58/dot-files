/// <reference types="node" resolution-mode="require"/>
export declare function spinner({ start, end, onError, while: update, }: {
    start: string;
    end: string;
    onError?: (e: any) => void;
    while: (...args: any) => Promise<any>;
}, { stdin, stdout }?: {
    stdin?: (NodeJS.ReadStream & {
        fd: 0;
    }) | undefined;
    stdout?: (NodeJS.WriteStream & {
        fd: 1;
    }) | undefined;
}): Promise<void>;
export interface Task {
    start: string;
    end: string;
    pending: string;
    onError?: (e: any) => void;
    while: (...args: any) => Promise<any>;
}
/**
 * Displays a spinner while executing a list of sequential tasks
 * Note that the tasks are not parallelized! A task is implicitly dependent on the tasks that preceed it.
 *
 * @param labels configures the start and end labels for the task queue
 * @param tasks is an array of tasks that will be displayed as a list
 * @param options can be used to the source of `stdin` and `stdout`
 */
export declare function tasks({ start, end }: {
    start: string;
    end: string;
}, t: Task[], { stdin, stdout }?: {
    stdin?: (NodeJS.ReadStream & {
        fd: 0;
    }) | undefined;
    stdout?: (NodeJS.WriteStream & {
        fd: 1;
    }) | undefined;
}): Promise<void>;
