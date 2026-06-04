/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DietaryAlternativesController } from './dietary-alternatives.controller';
import { DietaryAlternativesService } from './dietary-alternatives.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DietaryAlternative, DietaryAlternativeSchema } from './schema/DietaryAlternatives.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: DietaryAlternative.name, schema: DietaryAlternativeSchema}])],
  controllers: [DietaryAlternativesController],
  providers: [DietaryAlternativesService],
  exports: [DietaryAlternativesService],
})
export class DietaryAlternativesModule {}
