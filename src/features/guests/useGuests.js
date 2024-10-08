import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getGuests } from "../../services/apiGuests";
import { PAGE_SIZE } from "../../utils/constants";

export function useGuests() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //QUERY
  const {
    isLoading,
    data: { data: guests, count } = {},
    error,
  } = useQuery({
    queryKey: ["guests", page],
    queryFn: () => getGuests({ page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["guests", page + 1],
      queryFn: () => getGuests({ page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["guests", page - 1],
      queryFn: () => getGuests({ page: page - 1 }),
    });

  return { isLoading, guests, error, count };
}
