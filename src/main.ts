import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import {ValidationPipe} from "@nestjs/common";
import {parseBoolean} from "./utils/parse-boolean";
import {RedisStore} from "connect-redis";
import session from "express-session";
import cookieParser from 'cookie-parser'
import {graphqlUploadExpress} from "graphql-upload-ts";
import {createClient} from "redis";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const port = config.getOrThrow<number>('API_PORT')
    const redis = createClient({
        url: config.getOrThrow<string>('REDIS_URI')
    });

    await redis.connect();

    app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    )

    app.use(
        session({
            secret: config.getOrThrow<string>('SESSION_SECRET'),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: true,
            saveUninitialized: true,
            cookie: {
                domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: Number(config.getOrThrow<string>('SESSION_MAX_AGE')),
                httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
                secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
                sameSite: config.getOrThrow<string>('SESSION_SAME_SITE') as
                    | 'lax'
                    | 'strict'
                    | 'none',
            },
            store: new RedisStore({
                client: redis,
                prefix: config.getOrThrow<string>('SESSION_FOLDER'),
            }),
        }),
    );

    app.use(
        '/graphql',
        graphqlUploadExpress({maxFileSize: 100000000, maxFiles: 10})
    )

    app.enableCors({
        credentials: true,
        exposedHeaders: ['Set-Cookie'],
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN').split(', '),
        allowedHeaders: ['Content-Type', 'Origin', 'Accept', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    await app.listen(port ?? 3000, () => console.log(`Server started on port ${port}`));
}

bootstrap();
