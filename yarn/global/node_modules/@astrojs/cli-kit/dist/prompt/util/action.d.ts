/// <reference types="node" resolution-mode="require"/>
import type { Key } from "node:readline";
export declare const action: (key: Key, isSelect: boolean) => false | "first" | "abort" | "last" | "reset" | "down" | "up" | "submit" | "delete" | "deleteForward" | "exit" | "next" | "nextPage" | "prevPage" | "home" | "end" | "right" | "left" | undefined;
