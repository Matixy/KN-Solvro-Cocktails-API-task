import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// thanks guard protect extends default guard for jwt auth it provides also from using magic string AuthGuard('jwt') in each controller method
@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {}