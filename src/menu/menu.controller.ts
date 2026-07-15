/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FoodItemsService } from './food-items/food-items.service';
import { FoodItemDto } from './food-items/dto/FoodItem.dto';
import { FoodItem } from './food-items/schema/FoodItem.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('menu')
export class MenuController {

    constructor(private readonly menuService: MenuService, private readonly foodItemsService: FoodItemsService) {}

    @Post('add-food-item')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage()
    }))
    addFoodItem(@Body() data: FoodItemDto, @UploadedFile() file: Express.Multer.File){

        console.log('BODY:', data);
        console.log('FILE:', file?.originalname);

        return this.foodItemsService.addFoodItem(data, file);
    }

    @Get()
    async getMenuItems():Promise<FoodItem[]> {
        return this.menuService.getMenuItems();
    }

   
    @Post('test-add-food-item')
    async testAddFoodItem(@Body() data: FoodItemDto): Promise<{ success: boolean; data: FoodItem; message: string }> {
        const result = await this.foodItemsService.testAddFoodItem(data);
        return {
            success: true,
            data: result,
            message: 'Food item added successfully'
        }
    }

    @Put('update-food-item/:id')
    async updateFoodItem(@Param('id') id: string, @Body() data: FoodItemDto) {
        try {
            const result = await this.foodItemsService.updateFoodItem(id, data);
            return { success: true, message: 'Food item updated successfully', data: result };
        } catch (err) {
            console.error('Error updating food item:', err);
            return { success: false, message: 'Error updating food item' };
        }
    }

    @Get('food-item/:id')
    async getFoodItem(@Param('id') id: string) {
        return await this.foodItemsService.getFoodItem(id);
    }

    @Get('dietary-alternatives')
    async getAllDietaryAlternatives() {
         return this.foodItemsService.getAllDietaryAlternatives();
    }

    @Get('addons')
    async getAllAddons() {
        return this.foodItemsService.getAllAddons();
    }

    @Get('options')
    async getOptions() {
        return this.foodItemsService.getOptions();
    }

    
}   
