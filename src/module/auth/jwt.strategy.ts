import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Token Payload: ${JSON.stringify(payload)}`);
    if (!payload || !payload.id || !payload.role) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    return { id: payload.id, email: payload.email, role: payload.role }; // Include role
  }
}
