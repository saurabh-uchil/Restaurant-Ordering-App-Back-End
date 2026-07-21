/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodItem } from './schema/FoodItem.schema';
import { Model } from 'mongoose';
import { AddonService } from '../addon/addon.service';
import { DietaryAlternativesService } from '../dietary-alternatives/dietary-alternatives.service';
import { OptionGroupService } from '../option-group/option-group.service';
import { FoodItemDto } from './dto/FoodItem.dto';
/* import { DietaryAlternative } from '../dietary-alternatives/schema/DietaryAlternatives.schema'; */
/* import { Addon } from '../addon/schema/Addons.schema'; */
/* import { OptionGroup } from '../option-group/schema/OptionGroup.schema'; */

@Injectable()
export class FoodItemsService {
    constructor(
        @InjectModel(FoodItem.name) private foodItemModel: Model<FoodItem>,
        /* @InjectModel(DietaryAlternative.name) private dietaryAlternativeModel: Model<DietaryAlternative>, */
        /* @InjectModel(Addon.name) private addonModel: Model<Addon>, */
       /*  @InjectModel(OptionGroup.name) private optionGroupModel: Model<OptionGroup>, */
        private readonly addonService: AddonService,
        private readonly dietaryAlternativesService: DietaryAlternativesService,
        private readonly optionGroupService: OptionGroupService,
        ) {}

    

    getMenuItems(): Promise<FoodItem[]> {
        try {
            return this.foodItemModel.find().populate('addons').populate('dietaryAlternatives').populate({path: 'options', populate: {path: 'choices'}}).exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
        
    }

    async addFoodItem(data: FoodItemDto): Promise<FoodItem> {
        try {

            const addonIds = await this.addonService.getAddonIds(data.addons || []);
            const dietaryAlternativeIds = await this.dietaryAlternativesService.getDietaryAlternativeIds(data.dietaryAlternatives || []);
            const optionGroupIds = await this.optionGroupService.getOptionGroupIds(data.options || []);


            const foodItem = new this.foodItemModel({
                name: data.name,
                description: data.description,
                price: data.price,
                menuType: data.menuType,
                imageUrl: data.imageUrl,
                course: data.course,
                addons: addonIds,
                dietaryAlternatives: dietaryAlternativeIds,
                options: optionGroupIds,
                removableIngredients: data.removableIngredients,
            });

            return foodItem.save();
        }   catch (error) {
            throw new BadRequestException(error.message);
        }   
    }

    /* getAllDietaryAlternatives(): Promise<DietaryAlternative[]> {
        try {
            return this.dietaryAlternativeModel.find().exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    } */

    /* getAllAddons(): Promise<Addon[]> {
        try {
            return this.addonModel.find().exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    } */

    /* getOptions(): Promise<OptionGroup[]> { 
        try {
            return this.optionGroupModel.find().populate('choices').exec();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    } */

    async getFoodItem(id: string): Promise<FoodItem> {
        try {
            const foodItem = await this.foodItemModel.findById(id)
                .populate('addons')
                .populate('dietaryAlternatives')
                .populate({ path: 'options', populate: { path: 'choices' } })
                .exec();
            if (!foodItem) {
                throw new BadRequestException('Food item not found');
            }
            return foodItem;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateFoodItem(id: string, data: FoodItemDto): Promise<FoodItem> {
        try {
            const addonIds = await this.addonService.getAddonIds(data.addons || []);
            const dietaryAlternativeIds = await this.dietaryAlternativesService.getDietaryAlternativeIds(data.dietaryAlternatives || []);
            const optionGroupIds = await this.optionGroupService.getOptionGroupIds(data.options || []);

            const updatedFoodItem = await this.foodItemModel.findByIdAndUpdate(
                id,
                {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    menuType: data.menuType,
                    imageUrl: data.imageUrl,
                    course: data.course,
                    addons: addonIds,
                    dietaryAlternatives: dietaryAlternativeIds,
                    options: optionGroupIds,
                    removableIngredients: data.removableIngredients,
                },
                { new: true }
            ).populate('addons')
                .populate('dietaryAlternatives')
                .populate({ path: 'options', populate: { path: 'choices' } })
                .exec();

            if (!updatedFoodItem) {
                throw new BadRequestException('Food item not found');
            }

            return updatedFoodItem;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteFoodItem(id: string): Promise<FoodItem> {
        try {
            const deletedFoodItem = await this.foodItemModel.findByIdAndDelete(id);
            if (!deletedFoodItem) {
                throw new BadRequestException('Food item not found');
            }
            return deletedFoodItem;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async addFoodItemToARestaurant(data:FoodItemDto, restaurant_Id: string){
        try{
            const addonIds = await this.addonService.getAddonIds(data.addons || []);
            const dietaryAlternativeIds = await this.dietaryAlternativesService.getDietaryAlternativeIds(data.dietaryAlternatives || []);
            const optionGroupIds = await this.optionGroupService.getOptionGroupIds(data.options || []);


            const foodItem = new this.foodItemModel({
                restaurant_Id,
                name: data.name,
                description: data.description,
                price: data.price,
                menuType: data.menuType,
                imageUrl: data.imageUrl,
                course: data.course,
                addons: addonIds,
                dietaryAlternatives: dietaryAlternativeIds,
                options: optionGroupIds,
                removableIngredients: data.removableIngredients,
            });

            return foodItem.save();
        }catch(error){
            throw new BadRequestException("Error Creating Food Item")
        }
    }
}