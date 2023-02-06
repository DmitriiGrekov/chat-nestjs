import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private jwtService;
    private prismaService;
    constructor(jwtService: JwtService, prismaService: PrismaService);
    validateUser(login: string, pass: string): Promise<any>;
    login(authLoginDto: AuthLoginDto): Promise<{
        access_token: string;
        user_id: any;
        login: any;
    }>;
}
