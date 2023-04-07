import { PostBusiness } from "../../src/business/PostBusiness"
import { GetPostsInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { PostDatabaseMock } from "../mocks/database/PostDatabaseMock"
import { IdGeneratorMock } from "../mocks/service/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/service/TokenManagerMock"


describe("getPost", () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve retornar uma lista de posts", async () => {
        expect.assertions(2)
        
        const input: GetPostsInputDTO = {
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPosts(input)
        expect(response).toHaveLength(2)
        expect(response).toContainEqual({
            id: "id-post-mock",
            content: "primeiro post mock",
            likes: 0,
            dislikes: 0,
            comments: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator : {
                id: "id-mock",
                name: "Normal Mock"
            }
        })
    })

    test("dispara erro se o token for inválido", async () => {
       
        try {
            const input: GetPostsInputDTO = {
                token: undefined
            }
    
            await postBusiness.getPosts(input)
            
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("token ausente")
                expect(error.statusCode).toBe(400)
            }
        }
        
        
    })
})
