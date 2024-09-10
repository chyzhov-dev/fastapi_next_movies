import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "@/components/form/form-field";
import { useAuth } from "@/app/auth/providers/auth-provider";
import { LoginInput, loginSchema } from "@/app/auth/schema/login-schema";
import { LoaderButton } from "@/components/ui/loader-button";

export const LoginForm = () => {
  const { login } = useAuth();

  const form = useForm<LoginInput>({
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const { isValid, isSubmitting } = form.formState;
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(login)}>
        <FormField
          name="email"
          label="Email"
          register={(field) => {
            return <Input {...field} />;
          }}
        />

        <FormField
          name="password"
          label="Password"
          register={(field) => {
            return (
              <div className="relative">
                <Input {...field} type={showPassword ? "text" : "password"} />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 p-2"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            );
          }}
        />

        <LoaderButton
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
        >
          Sign In
        </LoaderButton>
      </form>
    </FormProvider>
  );
};
