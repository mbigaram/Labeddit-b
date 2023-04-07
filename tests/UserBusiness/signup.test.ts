import { UserBusiness } from "../../src/business/UserBusiness"
import { SignupInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { HashManagerMock } from "../mocks/service/HashManagerMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { UserDatabaseMock } from "../mocks/database/UserDatabaseMock"


describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignupInputDTO = {
            email: "example@email.com",
            name: "Example Mock",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("deve disparar erro caso name seja uma string", async () => {
        expect.assertions(1)
        try {
            const input: SignupInputDTO = {
                email: "example@email.com",
                name: null,
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'name' deve ser string")
            // expect(error.statusCode).toBe(400)
        }
    })

    test("deve disparar erro caso email seja uma string", async () => {
        expect.assertions(1)
        try {
            const input: SignupInputDTO = {
                email: null,
                name: "Example Mock",
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'email' deve ser string")
           
        }
       
    })

     test("deve disparar erro caso password seja uma string", async () => {
            expect.assertions(1)
            try {
                const input: SignupInputDTO = {
                    email: "example@email.com",
                    name: "Example Mock",
                    password: null
                }
    
                await userBusiness.signup(input)
    
            } catch (error) {
    
                if (error instanceof BadRequestError)
                    expect(error.message).toBe("'password' deve ser string")
                
            }
        })

    test("deve disparar erro caso email ja exista", async () => {
        expect.assertions(1)
        try {
            const input: SignupInputDTO = {
                email: "normal@email.com",
                name: "Example Mock",
                password: "bananinha"
            }

            await userBusiness.signup(input)

        } catch (error) {

            if (error instanceof BadRequestError)
                expect(error.message).toBe("'email' já existe")
           
        }
    })
})