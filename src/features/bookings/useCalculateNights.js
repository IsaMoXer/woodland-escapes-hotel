import { useEffect } from "react";
import { calculateNumOfNights } from "../../utils/helpers";

export function useCalculateNights(startDate, endDate, setValue) {
  useEffect(() => {
    if (startDate && endDate) {
      const nights = calculateNumOfNights(startDate, endDate);
      setValue("numNights", nights >= 0 ? nights : 0);
    }
  }, [startDate, endDate, setValue]);
}
