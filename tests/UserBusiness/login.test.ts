import { UserBusiness } from "../../src/business/UserBusiness"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"

import { USER_ROLES } from "../../src/types"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("Login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("testar login de um usuario NORMAL", async() => {
        const input = {
            email: "normal@email.com",
            password: "bananinha"
        }
      
        const response = await userBusiness.login(input)
        const token = "token-mock-normal"

        expect(response.token).toBe(token)
     })


    test("testar login de um usuario ADMIN", async() => {
        const input = {
            email: "admin@email.com",
            password: "bananinha"
        }
        
        const response = await userBusiness.login(input)
        const token = "token-mock-admin"
        expect(response.token).toBe(token)
                
    })

    test("deve disparar erro caso email seja uma string", async () => {
        
        try {
            const input: LoginInputDTO = {
                email: null,
                password: "bananinha"
            }

            await userBusiness.login(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'email' deve ser string")
            
        }
    })

    test("deve disparar erro caso o email não seja encontrado", async () => {
                  
        try {
            const input: LoginInputDTO = {
                email: "teste@email.com",
                password: "bananinha"
            }

            await userBusiness.login(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'email' não cadastrado")
            
        }
    })

    test("deve disparar erro caso o password seja incorreto", async () => {
         try {
            const input: LoginInputDTO = {
                email: "admin@email.com",
                password: "teste"
            }

            await userBusiness.login(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'password' incorreto")
            
        }
    })

})