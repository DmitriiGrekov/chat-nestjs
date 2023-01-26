import { CreateRdisCacheDto } from './dto/create-rdis-cache.dto';
import { UpdateRdisCacheDto } from './dto/update-rdis-cache.dto';
export declare class RadisCacheService {
    private cacheManager;
    constructor(cacheManager: any);
    create(createRdisCacheDto: CreateRdisCacheDto): Promise<void>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRdisCacheDto: UpdateRdisCacheDto): string;
    remove(id: number): string;
}
