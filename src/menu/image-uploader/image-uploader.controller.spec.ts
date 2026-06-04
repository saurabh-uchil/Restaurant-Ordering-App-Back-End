import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploaderController } from './image-uploader.controller';

describe('ImageUploaderController', () => {
  let controller: ImageUploaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploaderController],
    }).compile();

    controller = module.get<ImageUploaderController>(ImageUploaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
