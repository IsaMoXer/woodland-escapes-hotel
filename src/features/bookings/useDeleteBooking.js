import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {
  /*In order to invalidate the cache, we need to call a function inside the query client.
    For that we need to get the client by using a custom hook called useQueryClient(), then we
    can call the invalidate function */
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi, //same as id => deleteBooking(id)
    onSuccess: () => {
      /* alert("Cabin deleted successfully"); */
      toast.success("Booking deleted successfully");
      // re-fetch the data after deleting success by indalidating the cache
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: err => toast.error(err.message),
  });

  return { isDeleting, deleteBooking };
}
