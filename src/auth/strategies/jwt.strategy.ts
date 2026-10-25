import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../interfaces/auth.interfaces';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract JWT from the auth header
            ignoreExpiration: false, // do not ignore token expiration
            secretOrKey: process.env.JWT_SECRET || 'default_secret_key',
        });
    }
     

    // validate method is called automatically by passport to validate the JWT payload- run after the token is verified and not expired
    // return will be attached to the request object- req.user
    async validate(payload: JWTPayload) {
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role
        }
    }
}
