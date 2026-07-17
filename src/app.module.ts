/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AddonModule } from './menu/addon/addon.module';
import { DietaryAlternativesModule } from './menu/dietary-alternatives/dietary-alternatives.module';
import { OptionGroupModule } from './menu/option-group/option-group.module';
import { FoodItemsModule } from './menu/food-items/food-items.module';
import { ImageUploaderModule } from './menu/image-uploader/image-uploader.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [MenuModule, ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    AddonModule,
    DietaryAlternativesModule,
    OptionGroupModule,
    FoodItemsModule,
    ImageUploaderModule,
    UserModule,
    AuthModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
