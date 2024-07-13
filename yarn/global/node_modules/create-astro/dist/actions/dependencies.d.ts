import type { Context } from './context.js';
export declare function dependencies(ctx: Pick<Context, 'install' | 'yes' | 'prompt' | 'packageManager' | 'cwd' | 'dryRun' | 'tasks'>): Promise<void>;
