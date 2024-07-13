/// <reference types="node" resolution-mode="require"/>
type Message = string | Promise<string>;
export declare const say: (msg?: Message | Message[], { clear, hat, tie, stdin, stdout }?: {
    clear?: boolean | undefined;
    hat?: string | undefined;
    tie?: string | undefined;
    stdin?: (NodeJS.ReadStream & {
        fd: 0;
    }) | undefined;
    stdout?: (NodeJS.WriteStream & {
        fd: 1;
    }) | undefined;
}) => Promise<void>;
export declare const label: (text: string, c?: import("chalk").ChalkInstance, t?: import("chalk").ChalkInstance) => string;
export {};
