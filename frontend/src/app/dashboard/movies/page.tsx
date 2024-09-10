import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { MovieTable } from "./components/movie-table";
import { MovieCreateModal } from "./components/movie-create-modal";

export default function () {
  return (
    <Suspense>
      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle>Movies</CardTitle>

          <MovieCreateModal />
        </CardHeader>

        <CardContent>
          <MovieTable />
        </CardContent>
      </Card>
    </Suspense>
  );
}
