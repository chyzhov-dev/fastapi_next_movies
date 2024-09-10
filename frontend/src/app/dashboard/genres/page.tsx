import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { GenreTable } from "./components/genre-table";
import { GenreCreateModal } from "./components/genre-create-modal";

export default function () {
  return (
    <Suspense>
      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle>Genres</CardTitle>

          <GenreCreateModal />
        </CardHeader>

        <CardContent>
          <GenreTable />
        </CardContent>
      </Card>
    </Suspense>
  );
}
