import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_OPTIONS = { root: '' };

export default function mkdirSync(dest: string, { root }: { root?: string } = DEFAULT_OPTIONS): void {
    if (!fs.existsSync(dest)) {
        let folders = path.normalize(dest).split(path.sep).reverse();
        let dirPath = root ? root + path.sep : '';

        while (folders.length) {
            dirPath += folders.pop() + path.sep;
            !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
        }
    }
}
