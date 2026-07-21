/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { DietaryAlternativesService } from './dietary-alternatives.service';

@Controller('dietary-alternatives')
export class DietaryAlternativesController {
    constructor(private readonly dietaryAlternaivesService: DietaryAlternativesService){}
    
    @Get()
    async getAllDietaryAlternatives() {
         return this.dietaryAlternaivesService.getAllDietaryAlternatives();
    }
}
