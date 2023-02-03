import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(login: string, pass: string): Promise<any>;
    login(authLoginDto: AuthLoginDto): Promise<{
        access_token: string;
        user_id: any;
        login: any;
    }>;
}
