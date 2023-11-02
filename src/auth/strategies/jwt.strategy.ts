import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserStatus } from '../enum/user-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userRepository = this.dataSource.getRepository(User);

  constructor(
    private readonly dataSource: DataSource,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) throw new UnauthorizedException(`Token not valid`);

    if (
      user.status === UserStatus.INACTIVE ||
      user.status === UserStatus.DELETED
    ) {
      throw new UnauthorizedException(
        `User inactive or erased, please talk with the administrator.`,
      );
    }

    return user;
  }
}
