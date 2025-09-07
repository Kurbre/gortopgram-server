import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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

    async create(createUserInput: CreateUserInput): Promise<UserDocument> {
        const isThereUser = await this.usersModel.findOne({
            $or: [{
                login: createUserInput.login,
                email: createUserInput.email,
                phoneNumber: createUserInput.phoneNumber
            }],
        }).exec()
        if (isThereUser) throw new BadRequestException('Пользователь уже существует.')

        return this.usersModel.create({
            ...createUserInput,
            password: await hash(createUserInput.password),
        });
    }

    async findOne(email: string, login: string, phoneNumber: string): Promise<UserDocument> {
        const user = await this.usersModel.findOne({
            $or: [{login}, {email}, {phoneNumber}],
        }).exec()
        if (!user) throw new NotFoundException('Пользователь не найден.')

        return user
    }

    async findOneAndSelectPassword(filter: string): Promise<UserDocument & {
        password: string
    }> {
        const user = await this.usersModel.findOne({
            $or: [{login: filter}, {email: filter}, {phoneNumber: filter}],
        }).select('+password').exec()
        if (!user) throw new NotFoundException('Пользователь не найден.')

        return user
    }

    findAll() {
        return `This action returns all users`;
    }

    update(id: number, updateUserInput: UpdateUserInput) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
