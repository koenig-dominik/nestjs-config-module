import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { standardTests } from "../src/standard-tests";

describe('json file loader', () => {
    const data: {
        app?: INestApplication;
    } = {};

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule.withValidJsonFileLoader()],
        }).compile();

        data.app = module.createNestApplication();
        await data.app.init();
    });
    afterEach(async () => {
        await data.app?.close();
    });

    standardTests(data as {
        app: INestApplication
    });
});
