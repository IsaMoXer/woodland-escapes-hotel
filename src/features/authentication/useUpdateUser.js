import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser(reset) {
	const queryClient = useQueryClient();

	// Function to edit a cabin (React Query)
	const { isLoading: isUpdating, mutate: updateUser } = useMutation({
		// In React Query, mutation function can only receive one element! So we pass an object with as many elements as we need
		mutationFn: updateCurrentUser,
		onSuccess: () => {
			toast.success("User account successfully updated");

			// Reset the form fields after successful update
			if (reset) reset();

			// Invalidate and refetch the "user" query to ensure updated data
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
		},
		onError: err => toast.error(err.message),
	});
	return { isUpdating, updateUser };
}
