/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FoodItemsController } from './food-items.controller';
import { FoodItemsService } from './food-items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Addon, AddonSchema } from '../addon/schema/Addons.schema';
import { OptionGroup, OptionGroupSchema } from '../option-group/schema/OptionGroup.schema';
import { DietaryAlternative, DietaryAlternativeSchema } from '../dietary-alternatives/schema/DietaryAlternatives.schema';
import { FoodItem, FoodItemSchema } from './schema/FoodItem.schema';
import { AddonModule } from '../addon/addon.module';
import { DietaryAlternativesModule } from '../dietary-alternatives/dietary-alternatives.module';
import { OptionGroupModule } from '../option-group/option-group.module';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';

@Module({
  imports: [MongooseModule.forFeature([
    {name:FoodItem.name, schema: FoodItemSchema},
    {name: Addon.name, schema: AddonSchema},
    {name: OptionGroup.name, schema: OptionGroupSchema},
    {name: DietaryAlternative.name, schema: DietaryAlternativeSchema},
  ]),
    AddonModule, DietaryAlternativesModule, OptionGroupModule, ImageUploaderModule

],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
  exports: [FoodItemsService],
})
export class FoodItemsModule {}
