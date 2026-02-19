import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, EyeClosed, Eye, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRegister } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-12">
      <Link to="/" className="mb-8 block">
        <img src="/Logo.svg" alt="FINANCY" className="h-8 w-auto" />
      </Link>
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md">
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
          <p className="text-gray-600">
            Comece a controlar suas finanças ainda hoje
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome completo"
              icon={User}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                icon={Lock}
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
              <p className="text-xs text-gray-500 mt-2">
                A senha deve ter no mínimo 8 caracteres
              </p>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            Cadastrar
          </Button>
          {registerMutation.isError && (
            <p className="text-sm text-danger text-center">
              {(registerMutation.error as Error)?.message ??
                "Erro ao cadastrar"}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">ou</span>
          <span className="flex-1 h-px bg-gray-300" />
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Já tem uma conta?
        </p>
        <Link to="/" className="mt-4 block">
          <Button type="button" icon={LogIn} variant="outline" size="md" className="w-full">
            Fazer login
          </Button>
        </Link>
      </div>
    </div>
  );
}
