import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// docker run --env-file .env -p 4000:4000 nest_be:latest
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('DATN DOCS API')
    .setDescription('The DATN API description')
    .setVersion('1.0')
    .addTag('DATN')
    .build();
  // mongodb://localhost:27017/osdtb
  // console.log('process.env', process.env.MONGO_URI);
  // console.log(process.env.NODE_ENV);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ["amqp://localhost:5672"],
  //     queue: 'trips-queue'
  //   }
  // }
  // )
  // app.listen()
}
bootstrap();
