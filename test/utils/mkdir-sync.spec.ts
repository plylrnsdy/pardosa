import * as assert from 'assert';
import mkdirSync from '../../src/utils/mkdir-sync';
import * as fs from 'fs';

describe('mkdir sync', () => {

    before(() => {
        try {
            fs.unlinkSync('output/a');
            fs.unlinkSync('output/c');
        } catch (error) {
        }
    });

    it('options: { }', () => {
        const path = 'output/a/b';
        mkdirSync(path);
        assert.ok(fs.existsSync(path));
    });

    it('options: { root }', () => {
        const path = 'output/c/d';
        mkdirSync(path, { root: process.cwd() });
        assert.ok(fs.existsSync(path));
    });
});
