import { CommentsDatabase } from "../database/CommentsDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CreateCommentsInputDTO, CreateCommentsOutputDTO, DeleteCommentsInputDTO, EditCommentsInputDTO, GetCommentsInputDTO, GetCommentsOutputDTO, LikeOrDislikeCommentsInputDTO } from "../dtos/CommentsDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Comments } from "../models/CommentsModel"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { COMMENTS_LIKE, USER_ROLES,  LikeDislikeCommentsDB, CommentsModel, CommentsWithCreatorDB } from "../types"

export class CommentsBusiness {
    constructor(
        private commentsDatabase: CommentsDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {

        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsWithCreatorsDB: CommentsWithCreatorDB[] =
            await this.commentsDatabase.getCommentsWithCreators()

        const comments = commentsWithCreatorsDB.map((commentsWithCreatorDB) => {
            const comment = new Comments (
                commentsWithCreatorDB.id,
                commentsWithCreatorDB.post_id,
                commentsWithCreatorDB.creator_name,
                commentsWithCreatorDB.comments,
                commentsWithCreatorDB.likes,
                commentsWithCreatorDB.dislikes,
                commentsWithCreatorDB.created_at,
            )
            console.log(comment)
            return comment.toBusinessModel()
        })
        const output: GetCommentsOutputDTO = comments

        return output
    }


    public getCommentsById = async (input: GetCommentsInputDTO): Promise<CommentsModel> => {

        const { idToSearch, token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsDB = await this.commentsDatabase.findCommentsById(idToSearch)

        if (!commentsDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const comments = new Comments(
            commentsDB.id,
            commentsDB.post_id,
            commentsDB.user_id,
            commentsDB.comments,
            commentsDB.likes,
            commentsDB.dislikes,
            commentsDB.created_at,
        ).toBusinessModel()

        return comments
    }

    public createComments = async (input: CreateCommentsInputDTO): Promise<void> => {
        const { postId, comments, token } = input
        console.log(input);
        
        if (token === undefined) {
            throw new BadRequestError("token ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }
        const postDBExists = await this.postDatabase.findPostById(postId)
        
        if (postDBExists === null) {
            throw new NotFoundError("'id' não encontrado")
        }
                
        if (typeof comments !== "string") {
           
            throw new BadRequestError("'comments' deve ser uma string")
        }
        if(comments.length <1){
            throw new BadRequestError("'comments' deve ter pelo menos uma letra")
        }

        const newId = this.idGenerator.generate()

        const newComments = new Comments(
            newId,
            postId,
            payload.id,
            comments,
            0,
            0,
            new Date().toISOString(),
        )

        const newCommentsDB = newComments.toDBModel()

        await this.commentsDatabase.insertComments(newCommentsDB)
    }

    public editComments = async (input: EditCommentsInputDTO): Promise<void> => {
        const { idToEdit, token, comments } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("'token inválido");
        }

        if (typeof comments !== "string") {
            throw new BadRequestError("'comments' deve ser uma string")
        }

        const newCommentsDB = await this.commentsDatabase.findCommentsById(idToEdit)

        if (!newCommentsDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (newCommentsDB.user_id !== creatorId) {
            throw new BadRequestError("somente o criador do Comment pode editá-lo")
        }

        const comment = new Comments(
            newCommentsDB.id,
            newCommentsDB.post_id,
            newCommentsDB.user_id,
            newCommentsDB.comments,
            newCommentsDB.likes,
            newCommentsDB.dislikes,
            newCommentsDB.created_at,
        )

        comment.setComments(comments)

        const updatedCommentsDB = comment.toDBModel()

        await this.commentsDatabase.updateComments(updatedCommentsDB, idToEdit)

    }

    public deleteComments = async (input: DeleteCommentsInputDTO): Promise<void> => {
        const { idToDelete, token } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Usuário não está logado")
        }

        const commentsDBExists = await this.commentsDatabase.findCommentsById(idToDelete)

        if (!commentsDBExists) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (payload.role !== USER_ROLES.ADMIN && commentsDBExists.user_id !== creatorId) {
            throw new BadRequestError("somenste o criador do Comment pode deleta-lo");
        }


        await this.commentsDatabase.deleteComments(idToDelete)

    }

    public likeOrDislikeComments = async (input: LikeOrDislikeCommentsInputDTO): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("token é necessário")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }
        

        const commentsWithCreatorDB = await this.commentsDatabase.findCommentsWithCreatorById(idToLikeOrDislike)
        
        if (!commentsWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeCommentsDB = {
            comments_id: commentsWithCreatorDB.id,
            post_id: commentsWithCreatorDB.post_id,
            user_id: userId,
            like: likeSQLite
        }

        const comments = new Comments(
            commentsWithCreatorDB.id,
            commentsWithCreatorDB.post_id,
            commentsWithCreatorDB.user_id,            
            commentsWithCreatorDB.comments,
            commentsWithCreatorDB.likes,
            commentsWithCreatorDB.dislikes,
            commentsWithCreatorDB.created_at
        )

        const likeDislikeExists = await this.commentsDatabase
            .findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === COMMENTS_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentsDatabase.removeLikeDislike(likeDislikeDB)
                comments.removeLike()
            } else {
                await this.commentsDatabase.updateLikeDislike(likeDislikeDB)
                comments.removeLike()
                comments.addDislike()
            }

        } else if (likeDislikeExists === COMMENTS_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.commentsDatabase.updateLikeDislike(likeDislikeDB)
                comments.removeDislike()
                comments.addLike()
            } else {
                await this.commentsDatabase.removeLikeDislike(likeDislikeDB)
                comments.removeDislike()
            }

        } else {
            await this.commentsDatabase.likeOrDislikeComments(likeDislikeDB)

            like ? comments.addLike() : comments.addDislike()
        }

        const updatedCommentsDB = comments.toDBModel()
        console.log("chegou aqui")

        await this.commentsDatabase.updateComments(updatedCommentsDB, idToLikeOrDislike)
    }
}
