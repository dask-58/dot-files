import type { Context } from './context.js';
type PickedTypeScriptContext = Pick<Context, 'typescript' | 'yes' | 'prompt' | 'dryRun' | 'cwd' | 'exit' | 'packageManager' | 'install' | 'tasks'>;
export declare function typescript(ctx: PickedTypeScriptContext): Promise<void>;
export declare function setupTypeScript(value: string, ctx: PickedTypeScriptContext): Promise<void>;
export {};
