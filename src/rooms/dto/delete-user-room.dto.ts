import { PartialType } from '@nestjs/mapped-types';
import { AddUserRoomDto } from './add-user-room.dto';

export class DeleteUserRoomDto extends PartialType(AddUserRoomDto) { }
