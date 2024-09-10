import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MovieForm } from "./movie-form";
import { Movie } from "./movie-table";

type Props = {
  movie: Movie;
};

export function MovieEditModalContent(props: Props) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add movie</DialogTitle>
        <DialogDescription>Add movies to your collection</DialogDescription>
      </DialogHeader>

      <MovieForm defaultValues={props.movie} />
    </DialogContent>
  );
}
