import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {User} from "../users/entities/user.entity";
import {CreateUserInput} from "../users/dto/create-user.input";
import {LoginInput} from "./dto/login.input";

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {
    }

    @Mutation(() => User)
    register(@Args('createUserInput') createUserInput: CreateUserInput, @Context() context: any) {
        return this.authService.register(createUserInput, context.req)
    }

    @Mutation(() => User)
    login(@Args('loginInput') loginInput: LoginInput, @Context() context: any) {
        return this.authService.login(loginInput, context.req)
    }
}
