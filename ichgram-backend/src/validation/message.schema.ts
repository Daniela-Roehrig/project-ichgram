import * as yup from "yup";

export const messageSchema = yup.object({
  senderId: yup.string().required("senderId ist erforderlich"),
  receiverId: yup.string().required("receiverId ist erforderlich"),
  text: yup.string().required("text ist erforderlich"),

  timestamp: yup.string().notRequired(),
  id: yup.string().notRequired(),
});

