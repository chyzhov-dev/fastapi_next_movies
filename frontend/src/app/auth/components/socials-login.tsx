import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { Icon } from "@iconify/react";

export const SocialsLogin = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <a
        href={`${env.NEXT_PUBLIC_BACKEND_URL}/api/auth/redirect/google`}
        className="block"
      >
        <Button variant="outline" className="h-fit w-full">
          <Icon icon="devicon:google" className="mr-2 size-4" />
          Google
        </Button>
      </a>
    </div>
  );
};
