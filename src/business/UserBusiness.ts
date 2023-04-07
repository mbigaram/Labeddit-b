import { UserDatabase } from "../database/UserDatabase"
import { DeleteUserInputDTO, EditUserInputDTO, GetUsersInputDTO, GetUsersOutputDTO, LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, UserDB, USER_ROLES } from "../types";

export class UserBusiness { 
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public signup = async (input: SignupInputDTO) => {
        const { name, email, password } = input
        

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!email.match(/^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i)) {
            throw new BadRequestError("ERROR: 'email' deve ser tipo: 'example@example.example'.")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new BadRequestError("ERROR: 'Senha' deve conter pelo menos 8 caracteres com pelo menos uma letra maiúscula, pelo menos um número, e um carácter especial'.")
        }
        

        const emailAlreadyExists = await this.userDatabase.findUserByEmail(email)

        if (emailAlreadyExists) {
            throw new BadRequestError("'email' já existe")
        }

        const id = this.idGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)
        
        const role = USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            role,
            createdAt
        )

        const newUserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }

        await this.userDatabase.insertUser(newUserDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output = {
            token: token
        }

        return output
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }

        const userDB: UserDB | undefined = await this.userDatabase.findUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não cadastrado")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const hashedPassword = user.getPassword()

        const isPasswordCorrect = await this.hashManager
            .compare(password, hashedPassword)
        
        if (!isPasswordCorrect) {
            throw new BadRequestError("'password' incorreto")
        }
        
        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            token
        }

        return output
    }


public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { token } = input

    if (token === undefined) {
        throw new BadRequestError("token é necessário")
    }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
        throw new BadRequestError("'token' inválido")
    }

    const usersDB = await this.userDatabase.getUsers()

    const users = usersDB.map((userDB) => {
        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )
        return user.toBusinessModel()
    })

    const output: GetUsersOutputDTO = users

    return output
}

public editUser = async (input: EditUserInputDTO): Promise<void> => {
    const { idToEdit, token, email, password } = input

    if (token === undefined) {
        throw new BadRequestError("token é necessário")
    }

    if (idToEdit === undefined) {
        throw new BadRequestError("'id' é necessário")
    }

    // if (idToEdit !== "string") {
    //     throw new BadRequestError("'id' deve ser string")
    // }

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
        throw new BadRequestError("'token inválido");
    }

    if (email !== undefined) {
        if (typeof email !== "string") 
            throw new BadRequestError("'email' deve ser uma string")
    }

    if (password !== undefined) {
        if (typeof password !== "string") 
            throw new BadRequestError("'password' deve ser uma string")        
    }

    const newUserDB = await this.userDatabase.findUserById(idToEdit)

    if (!newUserDB) {
        throw new NotFoundError("'id' não encontrado")
    }

    const user = new User(
        newUserDB.id,
        newUserDB.name,
        newUserDB.email,
        newUserDB.password,
        newUserDB.role,
        newUserDB.created_at
    )

    if (password) {
        user.setPassword(password)
    }

    if (email) {
        user.setEmail(email)
    }

    const updatedUserDB = user.toDBModel()

    await this.userDatabase.editUser(updatedUserDB, idToEdit)
}

public deleteUser = async (input: DeleteUserInputDTO): Promise<boolean> => {
    const { idToDelete, token } = input

    if (token === undefined) {
        throw new BadRequestError("'token' inválido")
    }

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
        throw new BadRequestError("'token' inválido")
    }

    const userDBExists = await this.userDatabase.findUserById(idToDelete)

    if (!userDBExists) {
        throw new NotFoundError("'id' não existe");
    }

    const creatorId = payload.id

    if (payload.role !== USER_ROLES.ADMIN && userDBExists.id !== creatorId) {
        throw new BadRequestError("somente o próprio usuário ou um admin pode deleta-lo");
    }

    await this.userDatabase.deleteUser(idToDelete)

    return true
}
}