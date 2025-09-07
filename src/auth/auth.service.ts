import {Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {Request} from 'express'
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserInput} from "../users/dto/create-user.input";
import {mongoId} from "../utils/types/mongo-id";
import {LoginInput} from "./dto/login.input";
import {verify} from "argon2";
import {UserDocument} from "../users/user.model";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {
    }

    async register(createUserInput: CreateUserInput, req: Request): Promise<UserDocument> {
        const user = await this.usersService.create(createUserInput);
        const token = await this.generateJwtToken(user._id as mongoId);

        await this.saveSession(req, token)

        return user;
    }

    async login(loginInput: LoginInput, req: Request): Promise<UserDocument> {
        const user = await this.usersService.findOneAndSelectPassword(loginInput.filter)

        const isValidPassword = await verify(user.password, loginInput.password)
        if (!isValidPassword) throw new UnauthorizedException('Данные для авторизации не совпадают.');

        const token = await this.generateJwtToken(user._id as mongoId);

        await this.saveSession(req, token)

        return user;
    }

    private async generateJwtToken(_id: mongoId): Promise<string> {
        return this.jwtService.signAsync({_id})
    }

    private async saveSession(req: Request, token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            req.session.token = token

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сесси.'
                        )
                    )
                }

                resolve(token)
            })
        })
    }
}
