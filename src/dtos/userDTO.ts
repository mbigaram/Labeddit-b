import { PostModel, UserModel, USER_ROLES } from '../types'

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    token: string
}

export interface GetUsersInputDTO {
    token: string | undefined
}

export type GetUsersOutputDTO = UserModel[]

export interface EditUserInputDTO {
    idToEdit?: string,
    token: string | undefined,
    email?: string,
    password?: string
}

export interface EditUserOutputDTO {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    CreatedAt: string
}

export interface DeleteUserInputDTO {
    idToDelete: string,
    token: string | undefined
}