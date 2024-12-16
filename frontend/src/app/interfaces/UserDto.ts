import { RoleDto } from "./RoleDto";

export interface UserDto {
    id: number;
    username: string;
    password: string;
    email: string;
    imageProfile?: string;
    token: string;
    roles: RoleDto[];
    accountLocked: boolean;
}
