/// <reference types="node" resolution-mode="require"/>
import type { StdioOptions } from 'node:child_process';
export interface ExecaOptions {
    cwd?: string | URL;
    stdio?: StdioOptions;
    timeout?: number;
}
export interface Output {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export declare function shell(command: string, flags: string[], opts?: ExecaOptions): Promise<Output>;
