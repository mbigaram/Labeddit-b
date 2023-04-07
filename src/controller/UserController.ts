import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { DeleteUserInputDTO, EditUserInputDTO, GetUsersInputDTO, LoginInputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO"
import { BaseError } from "../errors/BaseError"

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) {}

    public signup = async (req: Request, res: Response) => {
         try {
            const input: SignupInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
           // console.log(input, "ESTOU AQUI")

            const output = await this.userBusiness.signup(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const output = await this.userBusiness.login(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
    public getUsers = async (req: Request, res: Response) => {
        try {
            const input: GetUsersInputDTO = {
                token: req.headers.authorization
            }

            const outPut = await this.userBusiness.getUsers(input)

            res.status(200).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editUser = async (req: Request, res: Response) => {
        try {
            const input: EditUserInputDTO = {
               idToEdit: req.params.id,
               token: req.headers.authorization,
               email: req.body.email,
               password: req.body.password
            }
               
            const outPut = await this.userBusiness.editUser(input)

            res.status(200).send(outPut)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const input: DeleteUserInputDTO = { 
                idToDelete: req.params.id,
                token: req.headers.authorization
            }

            const outPut = await this.userBusiness.deleteUser(input)

            res.status(200).send(outPut)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

}
