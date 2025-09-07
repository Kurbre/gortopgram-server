import {Field, InputType} from "@nestjs/graphql";
import {IsOptional, IsString} from "class-validator";

@InputType()
export class LoginInput {
    @Field(() => String)
    @IsOptional()
    @IsString()
    filter: string;

    @Field(() => String)
    @IsString()
    password: string;
}
