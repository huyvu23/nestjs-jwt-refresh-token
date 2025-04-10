import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// UserDocument is defined as a type alias for HydratedDocument<User>. This type represents a Mongoose document based on the User class. It ensures that TypeScript understands the structure of the document and provides type safety when working with it.
export type UserDocument = HydratedDocument<User>;

// The @Schema decorator is applied to the User class to mark it as a Mongoose schema. The { timestamps: true } option automatically adds createdAt and updatedAt fields to the schema, which are managed by Mongoose.
@Schema({ timestamps: true })
export class User {
  // The @Prop() decorator defines a property in the document
  @Prop({
    required: true,
    minlength: 3,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;
}

// SchemaFactory.createForClass(User) generates a Mongoose schema based on the User class. This schema can then be used to create a Mongoose model, which allows interaction with the corresponding MongoDB collection.
export const UserSchema = SchemaFactory.createForClass(User);
