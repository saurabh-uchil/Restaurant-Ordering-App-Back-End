/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthRequest } from "../../types/authRequestTypes";


export const CurrentUser = createParamDecorator((data: string, context: ExecutionContext)=>{
    
    const request: AuthRequest = context.switchToHttp().getRequest(); 
    
    if(data){
        return request?.payload?.[data];
    }
    return request?.payload;
})