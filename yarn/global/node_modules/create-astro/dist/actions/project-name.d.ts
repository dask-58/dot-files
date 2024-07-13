import type { Context } from './context.js';
export declare function projectName(ctx: Pick<Context, 'cwd' | 'yes' | 'dryRun' | 'prompt' | 'projectName' | 'exit'>): Promise<void>;
