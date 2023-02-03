import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { QueryDto } from './dto/query.dto';
export declare const userSelect: {
    select: {
        firstname: boolean;
        lastname: boolean;
        patroname: boolean;
        id: boolean;
        image: boolean;
        login: boolean;
    };
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findProfile(userId: number): Promise<User>;
    findAll(queryDto: QueryDto): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
