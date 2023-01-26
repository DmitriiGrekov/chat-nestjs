import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateRdisCacheDto } from './dto/create-rdis-cache.dto';
import { UpdateRdisCacheDto } from './dto/update-rdis-cache.dto';
import Cache from 'cache-manager'

@Injectable()
export class RadisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager) { }


  async create(createRdisCacheDto: CreateRdisCacheDto) {
    await this.cacheManager.set('key', 'value', { ttl: 2000 });
  }

  findAll() {
    return `This action returns all rdisCache`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rdisCache`;
  }

  update(id: number, updateRdisCacheDto: UpdateRdisCacheDto) {
    return `This action updates a #${id} rdisCache`;
  }

  remove(id: number) {
    return `This action removes a #${id} rdisCache`;
  }
}
