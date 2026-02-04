import { z } from "zod"; 
import { objectIdSchema } from "../../shared/index.js";

const findUserByUsernameSchema = z.object({
    username: z.string().min(1)
})

export const userSchema = {
    findUserByUsernameSchema
}
