import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { signup as signupApi } from "../../services/apiAuth";

export function useSignup() {
  const {
    isLoading,
    mutate: signup,
    error,
  } = useMutation({
    mutationFn: signupApi,
    // data = {session: {}, user: {...user_metadata:{avatar:"", email:...}}}
    //This is the data returned from the mutation function, in this case, signupApi
    onSuccess: data => {
      toast.success(
        "Account successfully created! Please, verify the new account from the user"
      );
    },
    onError: error => toast.error(error.message),
  });

  return { isLoading, signup };
}
