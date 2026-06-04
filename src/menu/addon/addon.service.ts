/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Addon } from './schema/Addons.schema';
import { Model, Types } from 'mongoose';
import { AddonsDto } from './dto/Addons.dto';

@Injectable()
export class AddonService {

    constructor(@InjectModel(Addon.name) private addonModel: Model<Addon>) {}


    async getAddonIds(addons: AddonsDto[]) {
        // Implementation for adding addons
        if (addons.length === 0) {
            return [];
        }
        else {
            const addonIds = await Promise.all(
                addons.map(async addon => {
                if(addon.id) {
                    if(Types.ObjectId.isValid(addon.id) === false) {
                        throw new BadRequestException(`Invalid Addon id format: ${addon.id}`);
                    }
                   const exists = await this.checkIfIdExists(addon.id);  
                   if(!exists) {
                            throw new BadRequestException(`Addon with id ${addon.id} does not exist`);
                     }
                    return new Types.ObjectId(addon.id);
                }
                else {
                    if(!addon.name || addon.price === undefined) {
                        throw new BadRequestException('Addon name and price are required');
                    }else{
                        //create new addon and return its id
                        const newAddon = await new this.addonModel(addon).save();
                        return newAddon._id;
                    }
                }
            })
            );
            return addonIds;
        }
    }

    async checkIfIdExists(id: string) {
        const result = await this.addonModel.exists({ _id: id });
        return result;
    }
}
