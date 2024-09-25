import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: createBooking } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("You have successfully created a booking");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: err => toast.error(err.message),
  });
  return { isLoading, createBooking };
}
