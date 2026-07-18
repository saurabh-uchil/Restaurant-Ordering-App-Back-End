/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema';
import { Model, Connection } from 'mongoose';
import { Restaurant } from '../restaurant/schema/restaurant.schema';
import { UserRole } from '../user/enums/user.role.enum';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';
import { LoginUserDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>, 

        @InjectModel(Restaurant.name) 
        private readonly restaurantModel: Model<Restaurant>,

        @InjectConnection()
        private readonly connection: Connection, 

        private readonly jwtService: JwtService
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
                    name: body.restaurantName,
                    slug: slugify(body.restaurantName, {lower:true, trim:true}), 
                    description: body.restaurantDescription
                }], {session});
                
                const [user] = await this.userModel.create([{
                    username: body.username,
                    email: slugify(body.email, {trim:true, lower:true}),
                    hashedPassword, 
                    role: UserRole.OWNER, 
                    restaurant: restaurant._id,
                }],{session});

                await session.commitTransaction();

                return { message: 'User registered successfully', userId: user._id, restaurant: restaurant._id };

            }
            catch(error){
                await session.abortTransaction();
                throw error
            }
            finally{
                await session.endSession();
            }    
    }

    async login (body: LoginUserDTO){
        const user = await this.userModel.findOne({email:body.email}).select('+hashedPassword').populate('restaurant');

        if(!user){
            throw new UnauthorizedException('Email not found');
        }
        
        const isValidPassword = await bcrypt.compare(body.password, user.hashedPassword);

        if(!isValidPassword){
            throw new UnauthorizedException('Invalid Password');
        }

        const payload = {sub: user._id, role: user.role, restaurant: user.restaurant._id}
        
        const accessToken = await this.jwtService.signAsync(payload);

        await this.userModel.updateOne({_id:user._id},{$set:{lastLogin: new Date()}});

        return {message:"Login Successful", accessToken, user}
    }
}
