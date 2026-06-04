/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OptionGroupController } from './option-group.controller';
import { OptionGroupService } from './option-group.service';
import { OptionGroup, OptionGroupSchema } from './schema/OptionGroup.schema';
import { Options, OptionsSchema } from './schema/Options.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    { name: OptionGroup.name, schema: OptionGroupSchema },
    { name: Options.name, schema: OptionsSchema },
  ])],
  controllers: [OptionGroupController],
  providers: [OptionGroupService],
  exports: [OptionGroupService],
})
export class OptionGroupModule {}
