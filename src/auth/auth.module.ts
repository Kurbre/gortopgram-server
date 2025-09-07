import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthResolver} from './auth.resolver';
import {UsersService} from "../users/users.service";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {jwtConfig} from "../configs/jwt.config";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/user.model";

@Module({
    providers: [AuthResolver, AuthService, UsersService, JwtStrategy],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtConfig,
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ]
})
export class AuthModule {
}