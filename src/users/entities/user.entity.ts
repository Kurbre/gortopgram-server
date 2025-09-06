import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class User {
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

    @Field(() => String)
    age: string;
}
