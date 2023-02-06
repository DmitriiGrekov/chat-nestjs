import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(authLoginDto: AuthLoginDto): Promise<{
        access_token: string;
        user_id: any;
        login: any;
    }>;
    rootOne(): Promise<{
        data: boolean;
    }>;
}
