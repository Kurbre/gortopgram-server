import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersResolver} from './users.resolver';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.model";

@Module({
    providers: [UsersResolver, UsersService],
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    exports: [UsersService],

})
export class UsersModule {
}
