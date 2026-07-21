/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FoodItemsService } from './food-items/food-items.service';
import { FoodItemDto } from './food-items/dto/FoodItem.dto';
import { FoodItem } from './food-items/schema/FoodItem.schema';

@Controller('menu')
export class MenuController {

    constructor(private readonly menuService: MenuService, private readonly foodItemsService: FoodItemsService) {}

    @Get()
    async getMenuItems():Promise<FoodItem[]> {
        return this.menuService.getMenuItems();
    }

   
    @Post('add-food-item')
    async testAddFoodItem(@Body() data: FoodItemDto): Promise<{ success: boolean; data: FoodItem; message: string }> {
        const result = await this.foodItemsService.addFoodItem(data);
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

    @Delete('delete-food-item/:id')
    async deleteFoodItem(@Param('id') id: string) {
        try {
            const result = await this.foodItemsService.deleteFoodItem(id);
            return { success: true, message: 'Food item deleted successfully', data: result };
        } catch (err) {
            console.error('Error deleting food item:', err);
            return { success: false, message: 'Error deleting food item' };
        }
    }    
}   
