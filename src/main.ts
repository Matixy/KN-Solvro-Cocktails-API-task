import 'dotenv/config';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // initialize the logger for the application
    const logger = new Logger("Bootstrap");

    // ValidationPipe setup for global request validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // strips properties that do not have any decorators in dto
            forbidNonWhitelisted: true, // throws 400 error if in request are properties that are not in dto
            transform: true, // automatically casts types based on dto
            transformOptions: {
                enableImplicitConversion: true // allows implicit type conversion for primitive types
            }
        }),
    );

    // set global api prefix for all routes
    app.setGlobalPrefix("api");

    app.enableCors({
        origin: "*", // allow requests from any origin- useful for dev and testing- RESTRICTED IN PRODUCTION
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // allowed methods
        credentials: true, // allow cookies to be sent with requests
    });

    // swagger setup for docs
    const config = new DocumentBuilder()
        .setTitle("Cocktails API")
        .setDescription("The cocktails management REST API documentation")
        .setVersion("1.0")
        .addBearerAuth() // setup for JWT authentication
        .addTag('Ingredients', 'Endpoints to ingredients management')
        .addTag('Cocktails', 'Endpoints to cocktails management')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document); // documentation- /api

    // start app on specified port
    const port = process.env.PORT as string || "3000";
    await app.listen(port);

    // log the application url and swagger docs url
    logger.log(`Application is running on: http://localhost:${port}/api`);
    logger.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
