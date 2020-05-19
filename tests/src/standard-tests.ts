import {INestApplication} from "@nestjs/common";
import {Configuration, DeepNestedConfiguration, LogConfiguration} from "./configuration";
import {validConfiguration, validDeepNestedConfiguration} from "./configuration.valid";

export function standardTests(data: {app: INestApplication}) {
    it(`loads complete configuration`, () => {
        const config = data.app.get(Configuration);
        expect(config).toStrictEqual(validConfiguration);
    });

    it(`loads nested namespace from default values`, () => {
        const config = data.app.get(LogConfiguration);
        expect(config).toStrictEqual(validConfiguration.log);
    });

    it(`loads deeply nested namespace`, () => {
        const config = data.app.get(DeepNestedConfiguration);
        expect(config).toStrictEqual(validDeepNestedConfiguration);
    });
}
