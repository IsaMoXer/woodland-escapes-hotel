import { useQuery } from "@tanstack/react-query";

import { getBookingsFromCabinFromToday } from "../../services/apiBookings";

export function useBookingsFromCabin(cabinId) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["bookings", cabinId],
    queryFn: () => getBookingsFromCabinFromToday(cabinId),
    retry: false,
    enabled: !!cabinId, // Only run the query if cabinId is provided
  });

  return { isLoading, error, data };
}
