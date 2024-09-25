import { useQuery } from "@tanstack/react-query";
import { getGuestByNationalId } from "../../services/apiGuests";

export function useGuest(nationalID) {
  const {
    isLoading,
    data: guest,
    error,
  } = useQuery({
    queryKey: ["guest", nationalID],
    queryFn: () => getGuestByNationalId(nationalID),
    retry: false,
    enabled: !!nationalID, // Only run the query if nationalID is provided
  });

  return { isLoading, error, guest };
}
