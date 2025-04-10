import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  isEmailExist = async (email: string): Promise<boolean> => {
    const user = await this.userModel.exists({ email });

    if (user) {
      return true;
    }
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    // check if email already exists
    const isEmailExist = await this.isEmailExist(createUserDto.email);
    if (isEmailExist) {
      throw new BadRequestException(
        `Email đã tồn tại ${createUserDto.email}.Vui lòng sử dụng email khác`,
      );
    }

    // hash password
    const hashPassword: string = await hashPasswordHelper(
      createUserDto.password,
    );
    return await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
