"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  genreSchema,
  GenreInput,
} from "@/app/dashboard/genres/schema/genre-schema";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form/form-field";
import { LoaderButton } from "@/components/ui/loader-button";
import { apiCallWrapper, toastOnError } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  defaultValues?: GenreInput;
  onSuccess?: () => void;
};

export function GenreForm(props: Props) {
  const queryClient = useQueryClient();

  const form = useForm<GenreInput>({
    mode: "all",
    defaultValues: props.defaultValues,
    resolver: zodResolver(genreSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (data: GenreInput) => {
    const response = await apiCallWrapper({
      endpoint: props.defaultValues?.id
        ? `api/genres/${props.defaultValues.id}`
        : "api/genres",
      method: props.defaultValues?.id ? "PUT" : "POST",
      body: data,
      onError: toastOnError,
    });

    if (response) {
      toast.success("Genre saved successfully");
      if (props.onSuccess) {
        props.onSuccess();
      }
    }

    queryClient.invalidateQueries({
      queryKey: ["genres"],
    });
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          label="Name"
          register={(field) => {
            return <Input {...field} />;
          }}
        />

        <LoaderButton
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
        >
          Save
        </LoaderButton>
      </form>
    </FormProvider>
  );
}
