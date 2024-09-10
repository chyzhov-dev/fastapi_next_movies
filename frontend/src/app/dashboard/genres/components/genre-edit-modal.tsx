import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GenreForm } from "./genre-form";
import { Genre } from "./genre-table";

type Props = {
  genre: Genre;
};

export function GenreEditModalContent(props: Props) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add genre</DialogTitle>
        <DialogDescription>Add genres to your collection</DialogDescription>
      </DialogHeader>

      <GenreForm defaultValues={props.genre} />
    </DialogContent>
  );
}
