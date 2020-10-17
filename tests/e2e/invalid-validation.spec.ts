import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('invalid validation', () => {
  it(`rejects configuration`, async () => {
    return expect(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule.withInvalidJsonFileLoader()],
      }).compile();

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    }).rejects.toThrowError();
  });

});
