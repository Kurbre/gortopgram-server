import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserInput} from './dto/create-user.input';
import {UpdateUserInput} from './dto/update-user.input';
import {Model} from "mongoose";
import {User, UserDocument} from "./user.model";
import {InjectModel} from "@nestjs/mongoose";
import {hash} from "argon2";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly usersModel: Model<UserDocument>) {
    }

    async create(createUserInput: CreateUserInput) {
        const isThereUser = await this.usersModel.findOne({
            $or: [{
                login: createUserInput.login,
                email: createUserInput.email,
                phoneNumber: createUserInput.phoneNumber
            }],
        })
        if (isThereUser) throw new BadRequestException('Пользователь уже существует.')

        return this.usersModel.create({
            ...createUserInput,
            password: await hash(createUserInput.password),
        });
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
