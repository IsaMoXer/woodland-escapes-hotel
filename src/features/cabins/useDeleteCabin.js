import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  /*In order to invalidate the cache, we need to call a function inside the query client. For that we need to get the client by using a custom hook called useQueryClient(), then we
  can call the invalidate function */
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi, //same as id => deleteCabin(id)
    onSuccess: () => {
      /* alert("Cabin deleted successfully"); */
      toast.success("Cabin deleted successfully");
      // re-fetch the data after deleting success by indalidating the cache
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
