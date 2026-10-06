import { z } from "zod";
import { AI_PROVIDER_IDS, REASONING_EFFORTS } from "@/lib/types";

export const characterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  class: z.string(),
  race: z.string(),
  level: z.number().int().min(1).max(20),
  backstory: z.string(),
  appearance: z.string(),
  worldSetting: z.string(),
  characterSheetMetadata: z
    .object({
      name: z.string().min(1).max(1024),
      size: z
        .number()
        .int()
        .min(0)
        .max(5 * 1024 * 1024),
      uploadedAt: z.number().int().min(0).max(8_640_000_000_000_000),
    })
    .optional(),
  characterSheet: z
    .string()
    .max(7_000_000)
    .regex(/^data:application\/pdf;base64,[A-Za-z0-9+/=\r\n]+$/)
    .or(z.literal(""))
    .optional(),
  portrait: z
    .string()
    .max(2_000_000)
    .regex(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/)
    .optional(),
  favorites: z.array(
    z.object({
      id: z.string().min(1),
      text: z.string(),
      type: z.enum(["mockery", "catchphrase"]),
      context: z.string().optional(),
      createdAt: z.number(),
    }),
  ),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export const backupSettingsSchema = z.object({
  provider: z.enum(AI_PROVIDER_IDS).optional(),
  model: z.string().min(1).optional(),
  temperature: z.number().min(0).max(2).optional(),
  reasoningEffort: z.enum(REASONING_EFFORTS).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  resultLayout: z.enum(["grid", "list"]).optional(),
});
export const backupSchema = z.object({
  characters: z
    .array(characterSchema)
    .refine(
      (characters) =>
        new Set(characters.map((character) => character.id)).size === characters.length,
      "Duplicate character IDs",
    ),
  settings: backupSettingsSchema.optional().default({}),
});
