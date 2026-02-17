import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, EyeClosed, Eye, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 block">
        <img src="/Logo.svg" alt="FINANCY" className="h-8 w-auto" />
      </Link>
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit((data) => login.mutate(data))}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              icon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="inline-flex items-center justify-center text-gray-700"
                >
                  {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-brand-base focus:ring-brand-base"
              />
              Lembrar-me
            </label>
            <Link
              to="#"
              className="text-brand-base font-medium hover:underline"
            >
              Recuperar senha
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={login.isPending}
          >
            Entrar
          </Button>
          {login.isError && (
            <p className="text-sm text-danger text-center">
              {(login.error as Error)?.message ?? "Erro ao fazer login"}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">ou</span>
          <span className="flex-1 h-px bg-gray-300" />
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Ainda não tem uma conta?
        </p>
        <Link to="/cadastro" className="mt-4 block">
          <Button type="button" variant="outline" size="lg" className="w-full">
            <UserRoundPlus size={20} />
            Criar conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
