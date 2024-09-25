import { useEffect } from "react";

export function useCalculatePrices(
  selectedCabinId,
  numNights,
  extrasPrice,
  cabins,
  setValue
) {
  useEffect(() => {
    if (selectedCabinId && numNights && extrasPrice !== undefined) {
      // Find the selected cabin
      const selectedCabin = cabins
        .filter(cabin => cabin.id === Number(selectedCabinId))
        ?.at(0);

      if (selectedCabin) {
        // Calculate the price per night
        const cabinPricePerNight =
          selectedCabin.regularPrice + selectedCabin.discount;

        // Calculate cabin price
        const cabinPrice = cabinPricePerNight * numNights;

        // Calculate total price
        const totalPrice = Number(cabinPrice) + Number(extrasPrice);

        // Update cabin price field and total price field
        setValue("cabinPrice", cabinPrice);
        setValue("totalPrice", totalPrice);
      }
    }
  }, [selectedCabinId, numNights, cabins, setValue, extrasPrice]);
}
