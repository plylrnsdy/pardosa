import * as fs from 'fs';
import * as path from 'path';
import mkdirSync from '../utils/mkdir-sync';
import { Middleware } from '..';
import { ISourceContext } from '../utils/source';
import { IFetchContext } from './fetch';


declare module storage {
    export interface IFileOptions {
        /**
         * The root directory of files. Default is `process.cwd()`.
         */
        root?: string
    }
    export interface IFileContext {
        state: {
            /**
             * Storage Response#`body` to `file`.
             */
            file?: string
            /**
             * Storage `files[].content` to `files[].file`.
             */
            files?: Array<{
                /**
                 * File's relative path based on root.
                 */
                file: string,
                /**
                 * File's content, a string or a JSON Object.
                 */
                content: string | Record<string, any>
            }>
        }
    }
}

const FILE_DEFAULT_OPTIONS = { root: process.cwd() };

const storage = {

    file(options: storage.IFileOptions = {}): Middleware<{}, ISourceContext & IFetchContext & storage.IFileContext> {

        options = Object.assign({}, FILE_DEFAULT_OPTIONS, options);

        return async function (ctx, next) {
            // after `fetch` before `router`
            if (storageFileBySteam(ctx)) {
                return;
            }

            await next();

            // after all middlewares
            storageFileBySteam(ctx) || storageFileByString(ctx);
        }

        function storageFileBySteam({ state: { file }, res }: IFetchContext & storage.IFileContext) {
            if (file == null || res == null || res.bodyUsed) return false;

            mkdirSync(path.dirname(file), options);
            res.body.pipe(fs.createWriteStream(path.join(options.root!, file)));
            console.info('[STORAGE]', file);

            return true;
        }

        function storageFileByString({ state: { files } }: IFetchContext & storage.IFileContext) {
            if (files == null || files.length === 0) return false;

            for (const { file, content } of files) {
                if (!file || !content) continue;

                mkdirSync(path.dirname(file), options);
                fs.writeFileSync(file, content);
                console.info('[STORAGE]', file);
            }

            return true;
        }
    }
}

export = storage;
