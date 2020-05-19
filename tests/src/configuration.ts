import {ArrayUnique, IsArray, IsIn, IsOptional, IsString, ValidateNested} from "class-validator";
import {LogLevel} from "@nestjs/common";
import {Type} from "class-transformer";

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

export class DeepNestedConfiguration {
    @IsOptional()
    text?: string;
}

export class NestedConfiguration {
    @ValidateNested() @Type(() => DeepNestedConfiguration)
    deeper?: DeepNestedConfiguration;
}

export class Configuration {
    @IsOptional()
    host?: string;
    @IsOptional()
    port?: number;
    @ValidateNested() @Type(() => LogConfiguration)
    log = new LogConfiguration();
    @ValidateNested() @Type(() => NestedConfiguration)
    nested?: NestedConfiguration;
}
