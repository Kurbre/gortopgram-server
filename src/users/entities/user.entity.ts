import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    _id: number;

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

    @Field(() => Number)
    age: number;
}
