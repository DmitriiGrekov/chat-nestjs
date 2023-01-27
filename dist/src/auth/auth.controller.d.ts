import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(authLoginDto: AuthLoginDto): Promise<{
        access_token: string;
    }>;
    rootOne(): Promise<{
        data: boolean;
    }>;
}
