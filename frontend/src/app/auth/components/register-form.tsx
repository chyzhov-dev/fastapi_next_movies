import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "@/components/form/form-field";
import { LoaderButton } from "@/components/ui/loader-button";
import {
  RegisterInput,
  registerSchema,
} from "@/app/auth/schema/register-schema";
import { apiCallWrapper, toastOnError } from "@/lib/api-client";
import { toast } from "sonner";

export const RegisterForm = () => {
  const form = useForm<RegisterInput>({
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  const { isValid, isSubmitting } = form.formState;
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const register = async (data: RegisterInput) => {
    const response = await apiCallWrapper({
      endpoint: "api/auth/register",
      method: "POST",
      body: data,
      onError: toastOnError,
    });

    if (response) {
      toast.success("Registered successfully. You can now sign in.");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(register)}
      >
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
          Register
        </LoaderButton>
      </form>
    </FormProvider>
  );
};
