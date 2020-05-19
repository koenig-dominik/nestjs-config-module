import {LoaderFunction} from '../config.module';
import {promises as fs} from 'fs';

export function jsonFileLoaderFactory(
    path: string,
    reviver?: (this: any, key: string, value: any) => any
): LoaderFunction {
    return async (): Promise<object> => {
        return JSON.parse(await fs.readFile(path, {encoding: 'utf8'}), reviver);
    }
}
