import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditCabin } from "../../services/apiCabins";

export function useEditCabin() {
  const queryClient = useQueryClient();

  // Function to edit a cabin (React Query)
  const { isLoading: isEditing, mutate: editCabin } = useMutation({
    // In React Query, mutation function can only receive one element! So we pass an object with as many elements as we need
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("You have successfully edited a cabin");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: err => toast.error(err.message),
  });
  return { isEditing, editCabin };
}
