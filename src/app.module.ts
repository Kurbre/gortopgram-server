import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {UsersModule} from './users/users.module';
import {join} from 'path'
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {mongoConfig} from "./configs/mongo.config";
import {AuthModule} from './auth/auth.module';
import {path} from "app-root-path";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(path, 'schemas/schema.graphql'),
            context: ({req, res}) => ({req, res})
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: mongoConfig
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
