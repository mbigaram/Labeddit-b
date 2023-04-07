
import { CommentsBusiness } from "../../src/business/CommentsBusiness"
import { GetCommentsInputDTO } from "../../src/dtos/CommentsDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { CommentsDatabaseMock } from "../mocks/database/CommentsDatabaseMock"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"

describe("getComment", () => {
    const commentBusiness = new CommentsBusiness(
        new CommentsDatabaseMock(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    // test("deve retornar uma lista de comments", async () => {
    //     expect.assertions(2)

    //     const input: GetCommentsInputDTO = {
    //         token: "token-mock-normal",
    //         idToSearch: ""
    //     }

    //     const response = await commentBusiness.getComments(input)
    //     expect(response).toHaveLength(2)
    //     expect(response).toContainEqual({
    //         id: "id-comment-mock",
    //         postId: "id-post-mock",
    //         userId: "id-mock",
    //         comments: "primeiro comment mock",
    //         likes: 0,
    //         dislikes: 0,
    //         createdAt: expect.any(String)
    //     })
    // })

    test("dispara erro se o token for inválido", async () => {
        expect.assertions(2)
        
        try {
            const input: GetCommentsInputDTO = {
                token: undefined,
                idToSearch: ""
            }

            await commentBusiness.getComments(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token é necessário")
                expect(error.statusCode).toBe(400)
            }
        }
    })
})
