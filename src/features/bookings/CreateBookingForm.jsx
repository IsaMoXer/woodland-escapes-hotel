import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import {
  convertToTimestamp,
  validateDateFormat,
  validateDateRange,
  validateNotInPast,
} from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";
import { useGuest } from "../guests/useGuest";
import { useSettings } from "../settings/useSettings";
import { useBookingsFromCabin } from "./useBookingsFromCabin";
import { useCalculateNights } from "./useCalculateNights";
import { useCheckBookingConflict } from "./useCheckBookingConflict";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCalculatePrices } from "./useCalculatePrices";

// Define your status options
const statusOptions = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "checked-in", label: "Checked In" },
];

function CreateBookingForm({ onCloseModal }) {
  const [guestId, setGuestId] = useState(null);
  const [cabinId, setCabinId] = useState(null);

  // Fetching data
  const { isLoading: isFetchingGuest, guest } = useGuest(guestId); // only called when there is cabinId
  const { data: bookingsCabin } = useBookingsFromCabin(cabinId);
  const { isLoading: isFetchingCabins, cabins } = useCabins();
  const { isLoading: isCreating, createBooking } = useCreateBooking();
  const { isLoading: isFetchingSettings, settings } = useSettings();

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    getValues,
    reset,
    formState,
  } = useForm();
  const { errors } = formState;

  // Watching fields
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedCabinId = watch("cabinId");
  const numNights = watch("numNights");
  const extrasPrice = watch("extrasPrice");

  // Custom hooks
  useCalculateNights(startDate, endDate, setValue);
  const isConflict = useCheckBookingConflict(
    selectedCabinId,
    startDate,
    endDate,
    bookingsCabin
  );
  useCalculatePrices(selectedCabinId, numNights, extrasPrice, cabins, setValue);

  const isWorking = isCreating || isFetchingCabins || isFetchingSettings;

  function onSubmit(data) {
    // format the data object from form to be suitable in supabase db
    const newBooking = {
      ...data,
      guestId: guest ? guest.id : "",
      startDate: convertToTimestamp(data.startDate),
      endDate: convertToTimestamp(data.endDate),
      cabinId: data.cabinId,
      observations: data.observations === undefined ? "" : data.observations,
    };

    createBooking(newBooking, {
      onSuccess: () => {
        reset(), onCloseModal?.();
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow
        label={"Guest national ID"}
        error={errors?.guestId?.message}
        note={guest ? guest.fullName : ""}
      >
        <Input
          type="text"
          id="guestId"
          disabled={isWorking}
          {...register("guestId", {
            required: "This field is required",
            validate: {
              exists: value => {
                if (isFetchingGuest) return "Checking...";
                if (guest && guest.nationalID === value) return true;
                if (!guest) return "Guest not found!";
              },
            },
          })}
          onBlur={() => {
            setGuestId(() => getValues("guestId")?.trim());
          }}
        />
      </FormRow>

      <FormRow label="Cabin name" error={errors?.cabinId?.message}>
        <Controller
          name="cabinId"
          control={control}
          defaultValue=""
          rules={{ required: "This field is required" }}
          render={({ field: { onChange, value } }) => (
            <select
              value={value}
              onChange={e => {
                onChange(e); // This updates the form state
                setCabinId(e.target.value);
              }}
              disabled={isWorking}
            >
              <option value="">Select a cabin</option>
              {cabins?.map(cabin => (
                <option key={cabin.id} value={cabin.id}>
                  {cabin.name}
                </option>
              ))}
            </select>
          )}
        />
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          placeholder="dd/mm/yyyy"
          type="text"
          id="startDate"
          disabled={isWorking}
          {...register("startDate", {
            required: "This field is required",
            validate: {
              format: value =>
                validateDateFormat(value) ||
                "Date must be in dd/mm/yyyy format",
              notInPast: value =>
                validateNotInPast(value) || "Date cannot be in the past",
              noConflict: () =>
                !isConflict ||
                "Selected dates conflict with an existing booking", // Check for conflict
            },
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          placeholder="dd/mm/yyyy"
          type="text"
          id="endDate"
          disabled={isWorking}
          {...register("endDate", {
            required: "This field is required",
            validate: {
              format: value =>
                validateDateFormat(value) ||
                "Date must be in dd/mm/yyyy format", // Validate date format
              range: value =>
                validateDateRange(getValues("startDate"), value) ||
                "Start date must be earlier than end date", // Validate date range
              noConflict: () =>
                !isConflict ||
                "Selected dates conflict with an existing booking", // Check for conflict
            },
          })}
        />
      </FormRow>

      <FormRow label="Number of nights" error={errors?.numNights?.message}>
        <Input
          defaultValue={0}
          type="number"
          id="numNights"
          disabled={true} // Disable this field to prevent manual input
          {...register("numNights")}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isWorking}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Guest should be at least 1",
            },
            validate: value =>
              value <= settings.maxGuestsPerBooking ||
              `Max number of guests is ${settings.maxGuestsPerBooking}`,
          })}
        />
      </FormRow>

      <FormRow label="Cabin price" error={errors?.cabinPrice?.message}>
        <Input
          type="number"
          id="cabinPrice"
          disabled={true}
          {...register("cabinPrice")}
        />
      </FormRow>

      <FormRow label="Extras price" error={errors?.extrasPrice?.message}>
        <Input
          type="number"
          id="extrasPrice"
          disabled={isWorking}
          {...register("extrasPrice", {
            required: "This field is required",
            min: {
              value: 0,
              message: "Extras price is not a discount",
            },
          })}
        />
      </FormRow>

      <FormRow label="Total price" error={errors?.totalPrice?.message}>
        <Input
          type="number"
          id="totalPrice"
          disabled={true}
          {...register("totalPrice")}
        />
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        <Controller
          name="status"
          control={control}
          defaultValue="" // Set the default value if needed
          rules={{ required: "This field is required" }} // Validation rule
          render={({ field }) => (
            <select {...field} disabled={isWorking}>
              <option value="">Select status</option> {/* Default option */}
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </FormRow>

      <FormRow label="Includes Breakfast" error={errors?.hasBreakfast?.message}>
        <Controller
          name="hasBreakfast" // This is used for form state management
          control={control}
          defaultValue={false} // Default value for the select
          render={({ field }) => (
            <select {...field} disabled={isWorking}>
              <option value={false}>No</option> {/* Default option */}
              <option value={true}>Yes</option>
            </select>
          )}
        />
      </FormRow>

      <FormRow label="Paid" error={errors?.isPaid?.message}>
        <Controller
          name="isPaid" // This is used for form state management
          control={control}
          defaultValue={false} // Default value for the select
          render={({ field }) => (
            <select {...field} disabled={isWorking}>
              <option value={false}>No</option> {/* Default option */}
              <option value={true}>Yes</option>
            </select>
          )}
        />
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          type="text"
          id="observations"
          disabled={isWorking}
          {...register("observations")}
        />
      </FormRow>
      <FormRow>
        <Button
          $variation="secondary"
          type="reset"
          disabled={isWorking}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>Create new booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
