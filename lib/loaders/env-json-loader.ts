import {LoaderFunction} from '../config.module';
import {EnvJsonParser} from 'env-json-parser';
import {ReviverFunction} from "env-json-parser/dist/variable-parser";

export function envJsonLoaderFactory(
    prefix: string,
    reviver?: ReviverFunction,
    caseSensitive?: boolean,
): LoaderFunction {
    const envJsonParser = new EnvJsonParser(prefix, reviver, caseSensitive);
    return async (): Promise<object> => {
        return Promise.resolve(envJsonParser.get());
    }
}
