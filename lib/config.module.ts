import { DynamicModule, Logger, Type, ValueProvider } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidatorOptions } from 'class-validator';

export type LoaderFunction = () => Promise<Record<string, unknown>>;

export interface ConfigurationModuleOptions<T> {
  isGlobal?: boolean;
  loader: LoaderFunction;
  schema: Type<T>;
  validatorOptions?: ValidatorOptions;
}

export class ConfigModule {
  private static readonly logger = new Logger(ConfigModule.name, true);

  static async forRoot<T>(
    options: ConfigurationModuleOptions<T>,
  ): Promise<DynamicModule> {
    let configContent;
    try {
      configContent = await options.loader();
    } catch (error) {
      throw new Error(
        `Configuration loader failed with error. ${error.message}`,
      );
    }

    let config: InstanceType<Type<T>>;
    try {
      config = plainToClass(options.schema, configContent);
    } catch (error) {
      throw new Error(
        `Failed to serialize loaded object to config schema. ${error.message}`,
      );
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-types
      await validateOrReject(config as Object, {
        ...{
          whitelist: true,
          forbidNonWhitelisted: true,
        },
        ...options.validatorOptions,
      });
    } catch (error) {
      if (error instanceof Array) {
        // validateOrReject rejects an array
        throw new Error(`Configuration validation error\n${error.join('')}`);
      } else {
        throw new Error(`Configuration validation error: ${error}`);
      }
    }

    const providers: ValueProvider[] = [
      {
        provide: (config as any).constructor,
        useValue: config,
      },
    ];
    providers.push(...this.unwrapNestedClassToValueProviders(config));

    for (const provider of providers) {
      this.logger.debug(
        `Providing configuration namespace ${
          (provider.provide as Type<T>).name
        }`,
      );
    }

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: providers,
      exports: providers.map((value) => value.provide),
    };
  }

  private static unwrapNestedClassToValueProviders(
    object: InstanceType<Type<unknown>>,
  ): ValueProvider[] {
    const providers: ValueProvider[] = [];
    for (const value of Object.values(object as Record<string, unknown>)) {
      if (
        typeof value !== 'object' ||
        value instanceof Array ||
        value === null ||
        value.constructor === Object
      ) {
        continue;
      }
      providers.push({
        provide: value.constructor,
        useValue: value,
      });

      providers.push(...this.unwrapNestedClassToValueProviders(value));
    }
    return providers;
  }
}
