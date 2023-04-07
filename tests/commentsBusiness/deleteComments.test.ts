import { DeleteCommentsInputDTO } from "../../src/dtos/CommentsDTO"
import { CommentsBusiness } from "../../src/business/CommentsBusiness"
import { CommentsDatabaseMock } from "../mocks/database/CommentsDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("deleteComment", () => {
    const commentBusiness = new CommentsBusiness(
        new CommentsDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("comment deletado com sucesso retorna true", async () => {
        const input: DeleteCommentsInputDTO = {
            idToDelete: "id-comment-mock",
            token: "token-mock-normal"
        }

        const response = await commentBusiness.deleteComments(input)
        expect(response).toBeUndefined()
    })

    test("disparar erro se o token for inválido", async () => {
        expect.assertions(2)

        try {
            const input: DeleteCommentsInputDTO = {
                idToDelete: "id-mock-admin",
                token: "token-mock-admin-errado"
            }
    
            await commentBusiness.deleteComments(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Usuário não está logado")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("disparar erro se o token for undefined", async () => {
        expect.assertions(2)

        try {
            const input: DeleteCommentsInputDTO = {
                idToDelete: "id-mock-admin",
                token: undefined
            }
    
            await commentBusiness.deleteComments(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
