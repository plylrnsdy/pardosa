import { Middleware } from "..";

declare module cleanStack { }

/**
 * Clean useless error stack.
 */
function cleanStack(): Middleware<{}, {}> {
    return async function (ctx, next) {
        try {
            await next();

        } catch (error) {
            error.stack = error.stack
                .replace(/\n.+\(internal[/\\].+/g, '')
                .replace(/\n\s+at (?:Generator.next|new Promise|__awaiter).+/g, '')
                .replace(/\n\s+at .+pardosa[/\\]compose.js.+/g, '');

            throw error;
        }
    }
}

export = cleanStack;
