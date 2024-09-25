import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteGuest as deleteGuestApi } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteGuest } = useMutation({
    mutationFn: deleteGuestApi,
    onSuccess: () => {
      toast.success("Guest deleted successfully");
      // re-fetch the data after deleting success by indalidating the cache
      queryClient.invalidateQueries({
        queryKey: ["guests"],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteGuest };
}
