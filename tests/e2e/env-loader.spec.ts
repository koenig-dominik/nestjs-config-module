import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { loadValidEnv } from '../src/env.valid';
import { AppModule } from '../src/app.module';
import { standardTests } from "../src/standard-tests";

describe('env json loader', () => {
    const data: {
        app?: INestApplication;
    } = {};

    beforeEach(async () => {
        loadValidEnv();

        const module = await Test.createTestingModule({
            imports: [AppModule.withEnvJsonLoader()],
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
