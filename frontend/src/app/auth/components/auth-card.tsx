"use client";

import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { SocialsLogin } from "./socials-login";

type Props = React.PropsWithChildren<{
  title: string;
  description: string;
}>;

export const AuthCard = (props: Props) => {
  return (
    <Card className="max-w-lg grow">
      <CardHeader>
        <CardTitle className="text-xl">{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {props.children}

        <div>
          <div className="my-4 flex w-full flex-row items-center gap-2">
            <Separator orientation="horizontal" className="shrink grow" />
            <p className="grow whitespace-nowrap text-sm text-muted-foreground">
              or continue with
            </p>
            <Separator orientation="horizontal" className="shrink grow" />
          </div>

          <SocialsLogin />
        </div>
      </CardContent>
    </Card>
  );
};
