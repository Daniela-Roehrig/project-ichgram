import * as yup from "yup";

export const commentValidationSchema = yup.object().shape({
  text: yup.string().trim().min(1).max(1000).required("Kommentar darf nicht leer sein"),
});
