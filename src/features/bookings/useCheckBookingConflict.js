import { useEffect, useState } from "react";
import { checkForBookingOverlap } from "../../utils/helpers";

export function useCheckBookingConflict(
  selectedCabinId,
  startDate,
  endDate,
  bookingsCabin
) {
  const [isConflict, setIsConflict] = useState(false);

  useEffect(() => {
    if (selectedCabinId && startDate && endDate) {
      const conflict = checkForBookingOverlap(
        startDate,
        endDate,
        bookingsCabin
      );
      setIsConflict(conflict);
    }
  }, [selectedCabinId, bookingsCabin, startDate, endDate]);

  return isConflict;
}
