const inputs = {
  email: {
    type: "email",
    placeholder: "Email",
    name: "email",
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email must contain @, dot and no spaces",
      },
    },
  },
  fullName: {
    type: "text",
    placeholder: "Full Name",
    name: "fullName",
    rules: {
      required: "Full Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
      maxLength: {
        value: 50,
        message: "Name must be less than 50 characters",
      },
    },
  },
  username: {
    type: "text",
    placeholder: "Username",
    name: "username",
    rules: {
      required: "Username is required",
      minLength: {
        value: 2,
        message: "Username must be at least 2 characters",
      },
      maxLength: {
        value: 20,
        message: "Username must be less than 20 characters",
      },
    },
  },
  password: {
    type: "password",
    placeholder: "Password",
    name: "password",
    rules: {
      required: "Password is required",
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]+$/,
        message: "Password must contain at least 1 letter, 1 number, and 1 special character",
      },
    },
  },
};

export default inputs;
