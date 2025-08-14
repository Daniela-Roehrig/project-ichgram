import AuthForm from "../../../shared/components/AuthForm/AuthForm";

const ForgotPasswordForm = ({ submitForm }) => {
  const onSubmitForm = (values) => {
    submitForm(values);
  };

  return (
    <AuthForm
      textBtn={"Reset your password"}
      submitForm={onSubmitForm}
      fieldsToRender={["email"]}
    />
  );
};

export default ForgotPasswordForm;
