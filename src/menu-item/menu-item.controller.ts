/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('menu-item')
export class MenuItemController {

    @Get()
    getMenuItems() {
        return {msg:"This is the menu items endpoint"};
    }

    @Post()
    addMenuItems(@Body() data: any) {
        console.log('Received data:', data);
        return {msg:"Menu item added successfully"};
    }
}
