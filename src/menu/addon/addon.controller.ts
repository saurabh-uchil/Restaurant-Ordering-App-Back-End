/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AddonService } from './addon.service';

@Controller('addon')
export class AddonController {
    constructor(private readonly addonService: AddonService){}
    
    @Get()
    getAllAddons() {
        return this.addonService.getAllAddons();
    }

}
