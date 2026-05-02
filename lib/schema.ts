import { z } from "zod"
import { formType } from "@/lib/formType";
export const formSchema = (formType: formType) => {
    return z.object({
        firstName: formType === "signup" ? z.string().min(1, "First name is required") : z.string().optional(),
        lastName: formType === "signup" ? z.string().min(1, "Last name is required") : z.string().optional(),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
    });
}