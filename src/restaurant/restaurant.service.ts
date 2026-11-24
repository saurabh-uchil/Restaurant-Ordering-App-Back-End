/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodItem } from '../menu/food-items/schema/FoodItem.schema';
import { Model } from 'mongoose';
import { Restaurant } from './schema/restaurant.schema';
import { Types } from "mongoose";
import { Order } from '../orders/schema/orders.schema';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class RestaurantService {
    constructor( 
        @InjectModel(FoodItem.name) 
        private foodItemModel: Model<FoodItem>,

        @InjectModel(Restaurant.name)
        private restaurantModel: Model<Restaurant>,

        @InjectModel(Order.name)
        private orderModel: Model<Order>,

        private readonly orderService: OrdersService
        
    ){}

    async getMenu(restaurant_Id: string){
        const restaurantObjectId = new Types.ObjectId(restaurant_Id);
        const menu = await this.foodItemModel.find({restaurant_Id:restaurantObjectId}) 
                .populate('addons')
                .populate('dietaryAlternatives')
                .populate({ path: 'options', populate: { path: 'choices' } });
        return menu;
    }

    async getRestaurant(restaurant_Id:string){
        const restaurant = await this.restaurantModel.findById({_id:restaurant_Id});
        return restaurant;
    }

    async getRestaurantBySlug(slug: string){
        const restaurant = await this.restaurantModel.findOne({slug});
        if(!restaurant){
            throw new NotFoundException(`Restaurant Not Found`);
        }
        return restaurant;
    }

    async getMenuBySlug(slug: string){
        const restaurant = await this.getRestaurantBySlug(slug);
        const restaurantId = restaurant._id.toString();
       
        const menu = await this.getMenu(restaurantId)

        return menu;
    }


    async getRestaurantStats(restaurantId: string){
        const restaurantObjectId = new Types.ObjectId(restaurantId);
        const totalMenuItems = await this.foodItemModel.findById({_id:restaurantObjectId});
        console.log(totalMenuItems);
        const totalOrders = await this.orderModel.countDocuments({ restaurantId: restaurantId, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
        console.log(totalOrders);
        const activeOrders = await this.orderService.getActiveOrdersByRestaurantId(restaurantId);
        return { activeOrders: activeOrders.length };

    }
}