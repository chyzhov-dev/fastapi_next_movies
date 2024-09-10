"use client";

import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  movieSchema,
  MovieInput,
} from "@/app/dashboard/movies/schema/movie-schema";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form/form-field";
import { Textarea } from "@/components/ui/textarea";
import { LoaderButton } from "@/components/ui/loader-button";
import { apiCallWrapper, toastOnError } from "@/lib/api-client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { cn, debounce } from "@/lib/utils";
import { GenrePage } from "../../genres/components/genre-table";
import { Badge } from "@/components/ui/badge";
import { GenreCreateModal } from "../../genres/components/genre-create-modal";

type Props = {
  defaultValues?: MovieInput;
  onSuccess?: () => void;
};

export function MovieForm(props: Props) {
  const queryClient = useQueryClient();

  const form = useForm<MovieInput>({
    mode: "all",
    defaultValues: props.defaultValues,
    resolver: zodResolver(movieSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (data: MovieInput) => {
    const genre_ids = data.genres.map((g) => g.id);

    const response = await apiCallWrapper({
      endpoint: props.defaultValues
        ? `api/movies/${props.defaultValues.id}`
        : "api/movies",
      method: props.defaultValues ? "PUT" : "POST",
      body: {
        ...data,
        genre_ids,
      },
      onError: toastOnError,
    });

    if (response) {
      toast.success("Movie saved successfully");
      if (props.onSuccess) {
        props.onSuccess();
      }
    }

    queryClient.invalidateQueries({
      queryKey: ["movies"],
    });
  };

  return (
    <FormProvider {...form}>
      <FormField
        name="name"
        label="Name"
        register={(field) => {
          return <Input {...field} />;
        }}
      />

      <FormField
        name="description"
        label="Description"
        register={(field) => {
          return <Textarea {...field} />;
        }}
      />

      <FormField
        name="release_year"
        label="Release year"
        register={(field) => {
          return <Input {...field} />;
        }}
      />

      <FormField
        name="genres"
        label="Genres"
        register={() => {
          return (
            <div className="w-full">
              <GenreSelect />
            </div>
          );
        }}
      />

      <LoaderButton
        isLoading={isSubmitting}
        isDisabled={!isValid || isSubmitting}
        onClick={() => form.handleSubmit(onSubmit)()}
      >
        Save
      </LoaderButton>
    </FormProvider>
  );
}

const GenreSelect = () => {
  const form = useFormContext<MovieInput>();
  const selectedGenres = useFieldArray({
    keyName: "customId",
    name: "genres",
    control: form.control,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const query = useQuery({
    queryKey: ["genres", searchQuery],
    queryFn: async () => {
      return await apiCallWrapper<GenrePage>({
        endpoint: `api/genres?page_size=10000&search_field=name&search_query=${searchQuery}`,
        method: "GET",
        onError: toastOnError,
      });
    },
  });

  const genres = query.data?.items ?? [];

  const [open, setOpen] = useState(false);

  const isSelected = (genreId: number) =>
    selectedGenres.fields.find((selectedGenre) => {
      return selectedGenre.id === genreId;
    });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-fit w-full justify-between px-2"
        >
          {selectedGenres.fields.length === 0 && "Select genres..."}
          <div className="flex flex-wrap items-center gap-2">
            {selectedGenres.fields.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>

          <Icon
            icon="radix-icons:caret-sort"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput
            defaultValue={searchQuery}
            onValueChange={debounce(setSearchQuery)}
            placeholder="Search genres..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty className="flex flex-col gap-4 pt-4 text-center text-sm">
              No genres found.
              <GenreCreateModal
                defaultValues={{
                  name: searchQuery,
                }}
                onSuccess={() => setSearchQuery("")}
              />
            </CommandEmpty>
            <CommandGroup>
              {genres.map((genre) => (
                <CommandItem
                  key={genre.id}
                  value={JSON.stringify(genre)}
                  onSelect={(currentValue) => {
                    const selectedGenre = JSON.parse(currentValue);

                    if (isSelected(selectedGenre.id)) {
                      selectedGenres.remove(selectedGenre);
                    } else {
                      selectedGenres.append(selectedGenre);
                    }
                  }}
                >
                  {genre.name}
                  <Icon
                    icon="ic:outline-check"
                    className={cn(
                      "ml-auto h-4 w-4",
                      isSelected(genre.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
