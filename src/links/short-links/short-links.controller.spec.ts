import { Test, TestingModule } from '@nestjs/testing';
import { ShortLinksController } from './short-links.controller';

describe('ShortLinksController', () => {
  let controller: ShortLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortLinksController],
    }).compile();

    controller = module.get<ShortLinksController>(ShortLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
