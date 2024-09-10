import { z } from "zod";

export const movieSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  description: z.string().min(3).max(200),
  release_year: z.coerce.number().min(1900).max(2100),
  genres: z.array(
    z.object({
      id: z.coerce.number(),
      name: z.string(),
    }),
  ),
});

export type MovieInput = z.infer<typeof movieSchema>;
