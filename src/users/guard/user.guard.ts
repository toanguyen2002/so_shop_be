import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { Role } from '../enum/role.enum';
export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';


export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


@Injectable()
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }
    //check auth
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        //check role
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        if (!token) {
            throw new UnauthorizedException();
        }

        if (!requiredRoles) {
            return true;
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: "nguyenquangtoan",
            });

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        const { user } = context.switchToHttp().getRequest();
        // console.log(user);
        // console.log(requiredRoles);

        if (requiredRoles.some((role) => user.role?.includes(role))) {
            return true;
        } else {
            throw new BaseExceptionFilter
        }

    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}