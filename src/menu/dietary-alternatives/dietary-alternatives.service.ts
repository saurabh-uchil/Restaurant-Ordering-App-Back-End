/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */


import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DietaryAlternative } from './schema/DietaryAlternatives.schema';
import { Model, Types } from 'mongoose';
import { DietaryAlternativesDto } from './dto/DietaryAlternatives.dto';

@Injectable()
export class DietaryAlternativesService {
    
   constructor( @InjectModel(DietaryAlternative.name) private dietaryAlternativeModel: Model<DietaryAlternative>){}

   async getDietaryAlternativeIds(dietaryAlternatives: DietaryAlternativesDto[]) {
           if (dietaryAlternatives.length === 0) {
               return [];
           }
   
           const dietaryAlternativeIds = await Promise.all(dietaryAlternatives.map(async da => {
               
                if(da.id) {
                    if(Types.ObjectId.isValid(da.id) === false) {
                        throw new BadRequestException(`Invalid Dietary Alternative id format: ${da.id}`);
                    }
                   const exists = await this.checkIfIdExists(da.id);  
                   if(!exists) {
                            throw new BadRequestException(`Dietary Alternative with id ${da.id} does not exist`);
                     }
                   return new Types.ObjectId(da.id);
               }
               else {
                   if(!da.name || !da.shortCode || da.additionalPrice === undefined) {
                       throw new BadRequestException('Dietary Alternative name, short code, and additional price are required');
                   }else{
                       const newDietaryAlternative = await new this.dietaryAlternativeModel(da).save();
                       return newDietaryAlternative._id;
                   }
               }
           }));
           return dietaryAlternativeIds;
       }
   
    async checkIfIdExists(id: string) {
        const result = await this.dietaryAlternativeModel.exists({ _id: id });
        return result;
    }

    async getAllDietaryAlternatives(): Promise<DietaryAlternative[]> {
        try {
            return this.dietaryAlternativeModel.find().exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
