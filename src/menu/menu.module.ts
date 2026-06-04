/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AddonModule } from 'src/menu/addon/addon.module';
import { DietaryAlternativesModule } from 'src/menu/dietary-alternatives/dietary-alternatives.module';
import { OptionGroupModule } from 'src/menu/option-group/option-group.module';

import { FoodItemsService } from './food-items/food-items.service';
import { FoodItemsModule } from './food-items/food-items.module';
import { FoodItem, FoodItemSchema } from './food-items/schema/FoodItem.schema';
import { ImageUploaderModule } from './image-uploader/image-uploader.module';
import { DietaryAlternative, DietaryAlternativeSchema } from './dietary-alternatives/schema/DietaryAlternatives.schema';
import { Addon, AddonSchema } from './addon/schema/Addons.schema';
import { OptionGroup, OptionGroupSchema } from './option-group/schema/OptionGroup.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: FoodItem.name, schema: FoodItemSchema }, 
    {name: DietaryAlternative.name, schema: DietaryAlternativeSchema  },
    {name: Addon.name, schema: AddonSchema},
    {name: OptionGroup.name, schema: OptionGroupSchema}
  ]),
    
    AddonModule, DietaryAlternativesModule, OptionGroupModule, FoodItemsModule, ImageUploaderModule 
  ],
  controllers: [MenuController],
  providers: [MenuService, FoodItemsService]
})
export class MenuModule {}
