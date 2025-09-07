import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersService} from './users.service';
import {User} from './entities/user.entity';
import {UpdateUserInput} from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {
    }

    @Query(() => [User], {name: 'users'})
    findAll() {
        return this.usersService.findAll();
    }

    @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    }
}
