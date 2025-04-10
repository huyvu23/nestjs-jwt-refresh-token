import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    // The MongooseModule.forFeature method is used to define which Mongoose schemas should be registered and available within the current module. It allows you to bind specific schemas to the module's context, making them accessible for dependency injection in services or controllers.
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporting UsersService allows other modules to use it
})
export class UsersModule {}
