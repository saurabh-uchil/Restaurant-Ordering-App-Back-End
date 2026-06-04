/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AddonController } from './addon.controller';
import { AddonService } from './addon.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Addon, AddonSchema } from './schema/Addons.schema';

@Module({
  imports: [MongooseModule.forFeature([ { name: Addon.name, schema:AddonSchema}] )],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
