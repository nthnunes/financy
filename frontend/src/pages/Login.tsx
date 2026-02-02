import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
      <Link
        to="/"
        className="flex items-center gap-2 text-primary font-semibold text-xl mb-8"
      >
        <Wallet size={32} className="text-primary" />
        FINANCY
      </Link>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900">Fazer login</h1>
        <p className="text-gray-500 text-sm mt-1">
          Entre na sua conta para continuar
        </p>

        <form
          onSubmit={handleSubmit((data) => login.mutate(data))}
          className="mt-6 space-y-4"
        >
          <Input
            label="E-mail"
            type="email"
            placeholder="mail@exemplo.com"
            icon={<Mail size={20} />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            icon={<Lock size={20} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              Lembrar-me
            </label>
            <Link to="#" className="text-primary hover:underline">
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
            <p className="text-sm text-red-500 text-center">
              {(login.error as Error)?.message ?? "Erro ao fazer login"}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-500 text-sm">ou</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <Link to="/cadastro" className="mt-6 block">
          <Button type="button" variant="outline" size="lg" className="w-full">
            Criar conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
