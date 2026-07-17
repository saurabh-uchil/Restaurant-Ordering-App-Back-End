/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema';
import { Model, Connection } from 'mongoose';
import { Restaurant } from '../restaurant/schema/restaurant.schema';
import { UserRole } from '../user/enums/user.role.enum';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>, 

        @InjectModel(Restaurant.name) 
        private readonly restaurantModel: Model<Restaurant>,

        @InjectConnection()
        private readonly connection: Connection
    ) {}

   
    async register(body: RegisterUserDto) {
            const existingUser = await this.userModel.findOne({email: body.email});
            
            if(existingUser){
                throw new ConflictException("A user with same email already exists");
            }
            
            const existingRestaurant = await this.restaurantModel.findOne({name: body.restaurantName});

            if(existingRestaurant){
                throw new ConflictException("A Resutaurant with same name already exists");
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);

            const session =  await this.connection.startSession();

            try{
                session.startTransaction();

                const [restaurant] = await this.restaurantModel.create([{
                    name: slugify(body.restaurantName, {lower:true, trim:true}), 
                    description: body.restaurantDescription
                }], {session});
                
                const [user] = await this.userModel.create([{
                    username: body.username,
                    email: slugify(body.email, {trim:true, lower:true}),
                    hashedPassword, 
                    role: UserRole.OWNER, 
                    restaurantId: restaurant._id,
                }],{session});

                await session.commitTransaction();

                return { message: 'User registered successfully', userId: user._id, restaurantId: restaurant._id };

            }
            catch(error){
                await session.abortTransaction();
                throw error
            }
            finally{
                await session.endSession();
            }    
    }
}
