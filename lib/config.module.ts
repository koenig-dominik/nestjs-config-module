import {DynamicModule, Logger, ValueProvider} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validateOrReject, ValidatorOptions} from 'class-validator';

export type LoaderFunction = () => Promise<object>;
export type ConfigurationSchema<T> = {new(...args: any[]): T; };

export interface ConfigurationModuleOptions<T> {
    isGlobal?: boolean;
    loader: LoaderFunction;
    schema: ConfigurationSchema<T>;
    validatorOptions?: ValidatorOptions;
}

export enum EXIT_CODE {
    LOAD = 100, // Exit code needs to be > 0 to count as an error
    SERIALIZATION,
    VALIDATION,
}

export class ConfigModule {

    private static readonly logger = new Logger(ConfigModule.name, true);

    static async forRoot<T extends object>(options: ConfigurationModuleOptions<T>): Promise<DynamicModule> {

        let configContent;
        try {
            configContent = await options.loader();
        } catch(error) {
            this.logger.error(`Configuration loader failed with error. ${error.message}`);
            process.exit(EXIT_CODE.LOAD);
        }

        let config: T;
        try {
            config = plainToClass(options.schema, configContent);
        } catch(error) {
            this.logger.error(`Failed to serialize loaded object to config schema. ${error.message}`);
            process.exit(EXIT_CODE.SERIALIZATION);
        }

        try {
            await validateOrReject(config, {
                ...{
                    whitelist: true,
                    forbidNonWhitelisted: true,
                },
                ...options.validatorOptions
            })
        } catch(error) {
            if (error instanceof Array) { // validateOrReject rejects an array
                this.logger.error(`Configuration validation error\n${error.join('')}`);
            } else {
                this.logger.error('Configuration validation error', error);
            }
            process.exit(EXIT_CODE.VALIDATION);
        }

        const providers: ValueProvider[] = [{
            provide: config.constructor,
            useValue: config
        }];
        providers.push(...this.unwrapNestedClassToValueProviders(config));

        for(const provider of providers) {
            this.logger.debug(`Providing configuration namespace ${(provider.provide as Function).name}`)
        }
        
        return {
            module: ConfigModule,
            global: options.isGlobal,
            providers: providers,
            exports: providers.map(value => value.provide)
        }
    }

    private static unwrapNestedClassToValueProviders(object: object): ValueProvider[] {
        const providers: ValueProvider[] = [];
        for (const value of Object.values(object)) {
            if (typeof value !== 'object' || value as any instanceof Array || value === null || value.constructor === Object) {
                continue;
            }
            providers.push({
                provide: value.constructor,
                useValue: value,
            })

            providers.push(...this.unwrapNestedClassToValueProviders(value));
        }
        return providers;
    }

}
