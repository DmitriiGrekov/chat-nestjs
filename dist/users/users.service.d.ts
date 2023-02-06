import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(params?: any): Promise<User[]>;
    findOne(id: number, otherParams?: {}): Promise<{
        login: string;
        id: number;
        firstname: string;
        lastname: string;
        patroname: string;
        image: string;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
    exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key>;
}
