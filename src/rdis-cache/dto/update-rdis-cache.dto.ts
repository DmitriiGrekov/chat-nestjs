import { PartialType } from '@nestjs/mapped-types';
import { CreateRdisCacheDto } from './create-rdis-cache.dto';

export class UpdateRdisCacheDto extends PartialType(CreateRdisCacheDto) {}
