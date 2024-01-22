// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';

// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { UserSchema } from './user.modal';

// @Module({
//   imports : [
//     MongooseModule.forFeature([{name : 'user' , schema : UserSchema}])
//   ],
//   controllers: [UserController],
//   providers: [UserService]
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from './user.modal';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Set the expiration time
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtModule],
})
export class UserModule {}
