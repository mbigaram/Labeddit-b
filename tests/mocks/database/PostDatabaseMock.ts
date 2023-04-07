import { BaseDatabase } from "../../../src/database/BaseDatabase";
import { PostWithCreatorDB, PostDB, LikeDislikeDB, POST_LIKE } from "../../../src/types"

export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POST = "posts"

    public getPostsWithCreators = async (): Promise<PostWithCreatorDB[]> => {
        return [
            {
                id: "id-post-mock",
                creator_id: "id-mock",
                content: "primeiro post mock",
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Normal Mock"
            },
            {
                id: "id-post-mock2",
                creator_id: "id-mock",
                content: "segundo post mock",
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator_name: "Admin Mock"
            }
        ]
    }

    public getPostComments = async () => {
        return [
            {
                id: "id-post-mock",
                content: "primeiro post mock",
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator: {
                    id: "id-mock",
                    name: "mock"
                },
                cmt: []
            },
            {
                id: 'id-post-mock2',
                content: 'segundo post mock',
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                creator: {
                    id: "id-mock",
                    name: "mock"
                },
                cmt: []
              }]

    }

    public getPosts = async (): Promise<PostDB[]> => {
        return [
            {
                id: "id-post-mock",
                creator_id: "id-mock",
                content: "primeiro post mock",
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: "id-post-mock2",
                creator_id: "id-mock",
                content: "segundo post mock",
                likes: 0,
                dislikes: 0,
                comments: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        ]
    }

    public findPostById = async (id: string): Promise<PostDB | undefined> => {
        switch (id) {
            case "id-post-mock":
                return {
                    id: "id-post-mock",
                    creator_id: "id-mock",
                    content: "primeiro post mock",
                    likes: 0,
                    dislikes: 0,
                    comments: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            case "id-post-mock2":
                return {
                    id: "id-post-mock2",
                    creator_id: "id-mock",
                    content: "segundo post mock",
                    likes: 0,
                    dislikes: 0,
                    comments: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            default:
                return undefined
        }
    }

    public insertPost = async (PostDB: PostDB): Promise<void> => {
    }

    public update = async (id: string, PostDB: PostDB ): Promise<void> => {
    }

    public delete = async (id: string): Promise<void> => {
    }

    public findPostWithCreatorById = async (id: string): Promise<PostWithCreatorDB | undefined> => {
        switch (id) {
            case "id-post-mock":
                return {
                    id: "id-post-mock",
                    creator_id: "id-mock",
                    content: "primeiro post mock",
                    likes: 0,
                    dislikes: 0,
                    comments: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Normal Mock"
                }
            case "id-post-mock2":
                return {
                    id: "id-post-mock2",
                    creator_id: "id-mock",
                    content: "segundo post mock",
                    likes: 0,
                    dislikes: 0,
                    comments: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    creator_name: "Admin Mock"
                }
            default:
                return undefined
        }
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
    }

    public findLikeDislike = async (likeOrDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {

        if (likeOrDislikeDBToFind) {
            return likeOrDislikeDBToFind.like === 1
                ? POST_LIKE.ALREADY_LIKED
                : POST_LIKE.ALREADY_DISLIKED

        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislike: LikeDislikeDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeDislike: LikeDislikeDB): Promise<void> => {
    }
}