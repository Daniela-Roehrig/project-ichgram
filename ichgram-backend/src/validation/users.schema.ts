import * as Yup from "yup";

export const updateUserSchema = Yup.object({
  fullName: Yup.string().trim(),
  username: Yup.string().trim(),
  avatar: Yup.string(),
  bio: Yup.string().max(500),
  website: Yup.string().url("Ungültige URL").nullable().optional().transform((v, o) => o === "" ? null : v),

}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export type UpdateUserSchema = Yup.InferType<typeof updateUserSchema>;
