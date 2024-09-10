"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GenreForm } from "./genre-form";
import { useState } from "react";
import { GenreInput } from "../schema/genre-schema";

type Props = {
  defaultValues?: GenreInput;
  onSuccess?: () => void;
};

export function GenreCreateModal(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"sm"} className={"gap-1"}>
          <PlusCircle className={"h-3.5 w-3.5"} />
          <span className={"text-xs"}>Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add genre</DialogTitle>
          <DialogDescription>Add genres to your collection</DialogDescription>
        </DialogHeader>

        <GenreForm
          onSuccess={() => {
            setOpen(false);
            if (props.onSuccess) {
              props.onSuccess();
            }
          }}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
}
