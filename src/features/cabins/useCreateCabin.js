import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  // Function to create a cabin (React Query)
  const { isLoading: isCreating, mutate: createCabin } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("You have successfully created a cabin");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      //reset(); // this function is from the useForm hook
    },
    onError: err => toast.error(err.message),
  });
  return { isCreating, createCabin };
}
