import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    email: number;

    @Field(() => String)
    password: string;

    @Field(() => String)
    phoneNumber: string;

    @Field(() => String)
    login: string;

    @Field(() => String)
    username: string;
}
