# Nest.js Config Module
Configuration module for Nest framework (node.js)

<a href="https://www.npmjs.com/nestjs-config-module"><img src="https://img.shields.io/npm/v/nestjs-config-module.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/nestjs-config-module"><img src="https://img.shields.io/npm/l/nestjs-config-module.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/nestjs-config-module"><img src="https://img.shields.io/npm/dm/nestjs-config-module.svg" alt="NPM Downloads" /></a>
<a href="https://www.npmjs.com/nestjs-config-module"><img src="https://github.com/koenig-dominik/nestjs-config-module/workflows/CI/badge.svg" alt="CI" /></a>

## Installation

```shell script
npm install --save nestjs-config-module
```

## Usage

You have to import the Module ConfigModule and initialize it with the forRoot function, this fetches a Javascript object with the `loader` function, then maps and validates that to the `schema`

This Module is not used as injection dependency directly, but rather its schema class and subclasses.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, envJsonLoaderFactory } from 'nestjs-config-module';
import { IsOptional, ValidateNested, IsArray, ArrayUnique, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { LogLevel } from "@nestjs/common";

export class LogConfiguration {
    @IsArray()
    @ArrayUnique()
    @IsString({
        each: true
    })
    @IsIn(['log', 'error', 'warn', 'debug', 'verbose'], {
        each: true
    })
    levels: LogLevel[] = ['log', 'error', 'warn'];
}

export class Configuration {
    @IsOptional()
    host?: string;
    @ValidateNested() @Type(() => LogConfiguration)
    log = new LogConfiguration();
}

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    loader: envJsonLoaderFactory('DEMO_'),
    schema: Configuration,
  })],
})
export class AppModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { Configuration } from 'app.module';

@Injectable()
export class FooService {
    constructor(
        private configuration: Configuration,
    ) {}
}
```

```typescript
import { Injectable } from '@nestjs/common';
import { LogConfiguration } from 'app.module';

@Injectable()
export class BarService {
    constructor(
        private logConfiguration: LogConfiguration,
    ) {}
}
```

### Loaders

this module comes with 2 builtin loaders:
- envJsonLoaderFactory
- jsonFileLoaderFactory

For the documentation on how to use the envJsonLoader see: [env-json-parser](https://www.npmjs.com/package/env-json-parser)

It's also possible to implement your own loader, it just needs to be a function that returns a Promise which resolves an object

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  loader: (): Promise<object> => {
    return Promise.resolve({
      host: 'localhost'
   })
  },
  schema: Configuration,
})
``` 
