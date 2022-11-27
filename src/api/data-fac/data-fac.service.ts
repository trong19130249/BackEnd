import { DataFacEntity } from '@/entities/data_fac.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateDimService } from '../date-dim/date-dim.service';
import { CreateDataFacDto } from './dto/create-data-fac.dto';
import { SearchDataAreaDto, SearchDataProvinceDto } from './dto/search-data-fac.dto';
import { UpdateDataFacDto } from './dto/update-data-fac.dto';

@Injectable()
export class DataFacService {
    constructor(
        @InjectRepository(DataFacEntity)
        private dataFacRepository: Repository<DataFacEntity>,
        private dateDimService: DateDimService
    ) {}
    async create(createDataFacDto: CreateDataFacDto) {
        return await 'This action adds a new dataFac';
    }

    async findAll() {
        return await this.dataFacRepository.find({
            relations: ['areaDim', 'dateDim', 'provinceDim'],
        });
    }

    async findOne(id: number) {
        return await this.dataFacRepository.findOne({
            where: { id: id },
            relations: ['areaDim', 'dateDim', 'provinceDim'],
        });
    }
    async searchByArea(searchDataAreaFactDto: SearchDataAreaDto) {
        const data = await this.dataFacRepository.find({
            where: {
                dateDim: { date: searchDataAreaFactDto.date },
                areaDim: searchDataAreaFactDto.area,
            },
            relations: ['areaDim', 'dateDim', 'provinceDim'],
            order: { dateDim: 'ASC' },
        });
        const result = {};
        data.forEach((item) => {
            if (result[`${item.provinceDim.id}`]) {
                result[`${item.provinceDim.id}`].push(item);
            } else {
                result[`${item.provinceDim.id}`] = [item];
            }
        });
        return result;
    }
    async home() {
        const date = await this.dataFacRepository.findOne({
            relations: ['dateDim'],
            order: { dateDim: 'DESC' },
        });
        const data = await this.dataFacRepository.find({
            where: { dateDim: date.dateDim },
            relations: ['areaDim', 'dateDim', 'provinceDim'],
            order: { dateDim: 'ASC' },
        });
        const result = {};
        data.forEach((item) => {
            if (result[`${item.provinceDim.id}`]) {
                result[`${item.provinceDim.id}`].push(item);
            } else {
                result[`${item.provinceDim.id}`] = [item];
            }
        });
        return result;
    }
    async searchByProvince(searchDataProvinceDto: SearchDataProvinceDto) {
        return await this.dataFacRepository.find({
            where: {
                dateDim: { date: searchDataProvinceDto.date },
                provinceDim: searchDataProvinceDto.province,
            },
            relations: ['areaDim', 'dateDim', 'provinceDim'],
        });
    }

    async update(id: number, updateDataFacDto: UpdateDataFacDto) {
        return await `This action updates a #${id} dataFac`;
    }

    async remove(id: number) {
        return await `This action removes a #${id} dataFac`;
    }
}