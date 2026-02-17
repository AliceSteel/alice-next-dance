import { z } from "zod";

export const zodProductSchema = z.object({
    name: z.string().min(2, { message: "Name is required and should be at least 2 characters long" }),
    price: z.string(),
    terms: z.array(z.string()).min(1, { message: "At least one term is required" })
});

export const zodInstructorSchema = z.object({
    name: z.string().min(2, { message: "Name is required and should be at least 2 characters long" }),
    slug: z.string().min(2, { message: "Dance Style is required and should be at least 2 characters long" }),
    instagram: z.string().optional(),
    youTube: z.string().optional(),
    bioLines: z.array(z.string()).min(1, { message: "At least one line of bio is required" }),
});
export const zodImageSchema = z.object({
    image: validateImageFile()
});

function validateImageFile() {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    return z.instanceof(File).refine((file) => {
        return !file || allowedTypes.includes(file.type) ;
    }, 'File must be an image type of JPEG, PNG, or GIF').refine((file) => {
        return !file || file.size <= maxSizeInBytes;
    }, 'File size must be less than 5MB');
}

export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message).join(", ");
        throw new Error(`Validation failed: ${errors}`);
    }

    return result.data;
}

