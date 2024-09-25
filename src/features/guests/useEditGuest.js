import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { editGuest as editGuestApi } from "../../services/apiGuests";

export function useEditGuest() {
  const queryClient = useQueryClient();

  const { isLoading: isEditing, mutate: editGuest } = useMutation({
    // In React Query, mutation function can only receive one element! So we pass an object with as many elements as we need
    mutationFn: ({ newGuest, id }) => editGuestApi(newGuest, id),
    onSuccess: () => {
      toast.success("You have successfully edited a guest");
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: err => toast.error(err.message),
  });
  return { isEditing, editGuest };
}
