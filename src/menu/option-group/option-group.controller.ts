/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { OptionGroupService } from './option-group.service';

@Controller('option-group')
export class OptionGroupController {
    constructor(private readonly optionGroupService: OptionGroupService){}
   
    @Get()
    async getOptions() {
        return this.optionGroupService.getOptions();
    }
    
}
