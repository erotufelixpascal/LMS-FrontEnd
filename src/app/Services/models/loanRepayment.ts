import {z} from "zod"

export const loanRepaymentValidator = z.object({
    loanNumber : z.number().gte(0),
    totalAmount : z.number().gte(0),
    principal : z.number().gte(0),
    interest : z.number().gte(0),
    balance : z.number().gte(0),
    term : z.number().gte(0),
    payment_date  :z.string(),
    next_payment_date: z.string()   

}).strict()

export type loanRepayment = z.infer<typeof loanRepaymentValidator>