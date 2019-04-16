import * as fs from 'fs';
import * as path from 'path';
import mkdirSync from '../lib/mkdir-sync';
import { Middleware } from '..';


declare module storage {
    export interface IFileOptions {
        /**
         * The root directory of files. Default is `process.cwd()`.
         */
        root?: string
    }
    export interface IFileContext {
        state: {
            type?: 'file'
            /**
             * File's relative path based on root.
             */
            file?: string
            /**
             * File's content.
             */
            content?: any
        }
    }
}


const storage = {

    file(options: storage.IFileOptions = {}): Middleware<{}, storage.IFileContext> {

        return function (ctx, next) {
            const { state: { type, file, content } } = ctx;

            if (type === 'file' && file && content) {

                mkdirSync(path.dirname(file), options);
                fs.writeFileSync(file, content);

                console.info('[STORAGE]', file);
            }

            return next();
        }
    }
}

export = storage;
