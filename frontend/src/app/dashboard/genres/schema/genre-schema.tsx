import { z } from "zod";

export const genreSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
});

export type GenreInput = z.infer<typeof genreSchema>;
