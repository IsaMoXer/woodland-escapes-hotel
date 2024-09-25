import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import { generateCountryFlagHttp, getCountryCode } from "../../utils/helpers";
import { useCreateGuest } from "./useCreateGuest";
import { useEditGuest } from "./useEditGuest";
import { useState } from "react";
import { useGuest } from "./useGuest";

function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const [guestId, setGuestId] = useState(null);

  // Fetching data
  const { id: editId, ...editValues } = guestToEdit;
  const isEditSession = Boolean(editId);
  const { guest } = useGuest(guestId); // Guest not fetched if no id
  const { isCreating, createGuest } = useCreateGuest();
  const { isEditing, editGuest } = useEditGuest();

  // Form setup
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const isWorking = isCreating || isEditing;

  // Regular expression to validate email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onSubmit = async data => {
    try {
      const countryFlagUrl = await generateCountryFlagHttp(
        data.nationality.trim()
      ); // Await the flag URL

      const newGuest = {
        ...data,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        nationalID: data.nationalID.trim(),
        nationality: data.nationality.trim(),
        countryFlag: countryFlagUrl || null, // Use the fetched flag URL
      };

      if (isEditSession) {
        editGuest(
          { newGuest, id: editId },
          {
            onSuccess: () => {
              reset();
              //Optional chaining in case this form is re-used and the function is not passed as a prop
              onCloseModal?.();
            },
          }
        );
      } else {
        createGuest(newGuest, {
          onSuccess: () => {
            reset();
            // Optional chaining in case this form is re-used and the function is not passed as a prop
            onCloseModal?.();
          },
        });
      }
    } catch (error) {
      console.error("Error fetching country flag:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isWorking}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: emailPattern,
              message: "Entered value does not match email format",
            },
          })}
        />
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isWorking}
          {...register("nationalID", {
            required: "This field is required",
            validate: {
              exists: value => {
                if (guest && guest.nationalID === value)
                  return "Guest already exists";
                if (!guest) return true;
              },
            },
          })}
          onBlur={() => {
            setGuestId(() => getValues("nationalID").trim());
          }}
        />
      </FormRow>

      <FormRow label="Country" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isWorking}
          {...register("nationality", {
            required: "This field is required",
            validate: async value => {
              const isCountry = await getCountryCode(value);
              if (isCountry) return true;
              return "Please, enter a valid country";
            },
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          //Optional chaining in case this form is re-used and the function is not passed as a prop
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit guest" : "Create new guest"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
