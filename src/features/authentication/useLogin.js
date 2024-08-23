import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: data => {
      /* setQueriesData will immediately after receiving the user object, place it into the cache, so that after logging in, the useUser hook, when getting the current user, uses the same query and the user data from the cache, saving an api call that is not necessary, since after logging in, the user is fetched through another api call from the useLogin query*/
      queryClient.setQueriesData(["user"], data.user);
      /**Opov: this setQueriesData prevents the access to protected routes after logging out, since otherwise, the old user stays in the cache? */
      /** This data object passed in the onSuccess function, is the one returned from calling the loginApi function, so in this case data = {session: {}, user: {}}  */
      navigate("/dashboard", { replace: true });
    },
    onError: err => {
      console.log("ERROR", err);
      toast.error("Provided email or password are incorrect");
    },
  });
  return { login, isLoading };
}
