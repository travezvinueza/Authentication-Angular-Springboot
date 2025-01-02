import { RoleDto } from "./RoleDto";

export interface UserDto {
    id: number;
    name: string;
    password: string;
    email: string;
    imageProfile?: string;
    creationDate: string;
    token: string;
    roles: RoleDto[];
    accountLocked: boolean;
}
