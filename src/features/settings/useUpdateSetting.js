import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  // Function to edit a cabin (React Query)
  const { isLoading: isUpdating, mutate: updateSetting } = useMutation({
    // In React Query, mutation function can only receive one element! So we pass an object with as many elements as we need
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("You have successfully updated a setting");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: err => toast.error(err.message),
  });
  return { isUpdating, updateSetting };
}
