/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OptionGroup } from './schema/OptionGroup.schema';
import { Options } from './schema/Options.schema';
import { Model, Types } from 'mongoose';
import { OptionGroupDto } from './dto/OptionGroup.dto';

@Injectable()
export class OptionGroupService {
    constructor( 
        @InjectModel(OptionGroup.name) private optionGroupModel: Model<OptionGroup>,
        @InjectModel(Options.name) private optionModel: Model<Options>) {}
        async getOptionGroupIds(optionGroups?: OptionGroupDto[]): Promise<Types.ObjectId[]> {

    if (!optionGroups?.length) {
        return [];
    }

  return await Promise.all(
    optionGroups.map(async (og) => {

      // EXISTING OPTION GROUP
      if (og.id) {
         
        if(Types.ObjectId.isValid(og.id) === false) {
                throw new BadRequestException(`Invalid Option Group id format: ${og.id}`);
              }

        const exists = await this.checkIfIdExists(og.id);  
            if(!exists) {
                throw new BadRequestException(`Option Group with id ${og.id} does not exist`);
              }
        
        return new Types.ObjectId(og.id);
      }

      // NEW OPTION GROUP
      if (!og.name || !og.choices?.length) {
        throw new BadRequestException(
          'OptionGroup must have either id or name, choices',
        );
      }

      // Create options first
      const optionIds = await Promise.all(
        og.choices.map(async (opt) => {
          if (!opt.name) {
            throw new BadRequestException('Option name is required');
          }

          const newOption = await this.optionModel.create({
            name: opt.name,
            extraCost: opt.extraCost ?? 0,
          });

          return newOption._id;
        }),
      );

      // Create option group
      const newOptionGroup = await this.optionGroupModel.create({
        name: og.name,
        choices: optionIds,
      });

      return newOptionGroup._id;
    }),
  );
}


async checkIfIdExists(id: string) {
        const result = await this.optionGroupModel.exists({ _id: id });
        return result;
}

getOptions(): Promise<OptionGroup[]> { 
        try {
            return this.optionGroupModel.find().populate('choices').exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
