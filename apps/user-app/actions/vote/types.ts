import { z } from "zod";
import { VoteHandleSchema } from "./schema";


export type VoteHandleType = z.infer<typeof VoteHandleSchema>;
