import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post()
  create(@Body() dto: CreateAffiliateDto) {
    return this.affiliateService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.affiliateService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAffiliateDto) {
    return this.affiliateService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.affiliateService.remove(id);
  }
} 