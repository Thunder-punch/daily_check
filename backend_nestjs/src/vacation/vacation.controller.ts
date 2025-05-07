import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { VacationService } from './vacation.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';

@Controller('vacation')
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Post()
  create(@Body() dto: CreateVacationDto) {
    return this.vacationService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.vacationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateVacationDto) {
    return this.vacationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.vacationService.remove(id);
  }
} 