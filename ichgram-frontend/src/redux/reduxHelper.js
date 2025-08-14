
export const pending = (store) => {
  store.loading = true;
  store.error = null;
};

export const rejected = (store, action) => {
  store.loading = false;

  store.error =
    typeof action.payload === "string"
      ? action.payload
      : action.payload?.message ||
        action.error?.message ||
        "An unknown error occurred.";
};
