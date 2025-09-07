import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {User, UserDocument} from "../../users/user.model";
import {mongoId} from "../../utils/types/mongo-id";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
        })
    }

    async validate({_id}: { _id: mongoId }) {
        return await this.userModel.findById(_id).exec()
    }
}