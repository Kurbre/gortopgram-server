import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({unique: true, default: null})
    email: string

    @Prop({unique: true})
    login: string

    @Prop({select: false})
    password: string

    @Prop({unique: true, default: null})
    phoneNumber: string

    @Prop()
    username: string

    @Prop({default: null})
    age: number
}

export const UserSchema = SchemaFactory.createForClass(User)
