import express from "express"
import { CommentsBusiness } from "../business/CommentsBusiness"
import { CommentsController } from "../controller/CommentsController"
import { CommentsDatabase } from "../database/CommentsDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const commentsRouter = express.Router()

const commentsController = new CommentsController(
    new CommentsBusiness(
        new CommentsDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
    )
)
commentsRouter.post("/:id", commentsController.CreateComments)
commentsRouter.put("/:id", commentsController.editComments)
commentsRouter.delete("/:id", commentsController.deleteComments)
commentsRouter.get("/", commentsController.getComments)
commentsRouter.get("/:id", commentsController.getCommentsById)
commentsRouter.put("/:id/like", commentsController.likeDislike)


// commentsRouter.post("/:id", commentsController.CreateComments)
// commentsRouter.put("/:id", commentsController.editComments)
// commentsRouter.delete("/:id", commentsController.deleteComments)
// commentsRouter.get("/", commentsController.getComments)
// commentsRouter.get("/:id", commentsController.getCommentsById)
// commentsRouter.put("/:id/like", commentsController.likeDislike)
