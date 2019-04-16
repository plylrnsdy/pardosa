import { Middleware } from '..';


declare module schema { }

/**
 * Use XPath to extract data to `ctx.state` from html.
 *
 * @param schema an nested object which key is string and value is xpath string or another schema.
 */
function schema(schema: any): Middleware<Record<string, any>, {}> {

    return function (ctx, next) {
        const { response, state } = ctx;

        for (const name in schema) {
            state[name] = travel(schema[name]);
        }

        function travel(node: any) {
            if (typeof node === 'string') return response.xpath(node).value();

            for (const name in node) {
                node[name] = travel(node[name]);
            }

            return node;
        }

        return next();
    }
}

export = schema;
