import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createGuest as createGuestApi } from "../../services/apiGuests";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { isLoading: iseCreating, mutate: createGuest } = useMutation({
    mutationFn: createGuestApi,
    onSuccess: () => {
      toast.success("You have successfully created a guest");
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { iseCreating, createGuest };
}
