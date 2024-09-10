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
import { MovieForm } from "./movie-form";
import { useState } from "react";

export function MovieCreateModal() {
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
          <DialogTitle>Add movie</DialogTitle>
          <DialogDescription>Add movies to your collection</DialogDescription>
        </DialogHeader>

        <MovieForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
