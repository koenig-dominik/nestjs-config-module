import { DynamicModule, Module } from '@nestjs/common';
import {ConfigModule, envJsonLoaderFactory, jsonFileLoaderFactory} from '../../lib';
import {Configuration} from './configuration';

@Module({})
export class AppModule {
    constructor(
    ) {}

    static withValidEnvJsonLoader(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    loader: envJsonLoaderFactory('TEST_'),
                    schema: Configuration
                }),
            ],
        };
    }

    static withValidJsonFileLoader(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    loader: jsonFileLoaderFactory('tests/src/valid.json'),
                    schema: Configuration
                }),
            ],
        };
    }

    static withInvalidJsonFileLoader(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    loader: jsonFileLoaderFactory('tests/src/invalid.json'),
                    schema: Configuration
                }),
            ],
        };
    }

}
