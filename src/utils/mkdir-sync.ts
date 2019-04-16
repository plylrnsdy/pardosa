import * as fs from 'fs';
import * as path from 'path';


export default function mkdirSync(dest: string, { root = '' }: { root?: string } = {}): void {
    if (!fs.existsSync(dest)) {
        let folders = path.normalize(dest).split(path.sep).reverse();
        let dirPath = root;

        while (folders.length) {
            dirPath += folders.pop() + path.sep;
            !fs.existsSync(dirPath) && fs.mkdirSync(dirPath);
        }
    }
}
