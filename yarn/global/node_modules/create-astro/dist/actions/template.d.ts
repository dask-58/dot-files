import type { Context } from './context.js';
export declare function template(ctx: Pick<Context, 'template' | 'prompt' | 'yes' | 'dryRun' | 'exit' | 'tasks'>): Promise<void>;
export declare function getTemplateTarget(tmpl: string, ref?: string): string;
export default function copyTemplate(tmpl: string, ctx: Context): Promise<void>;
