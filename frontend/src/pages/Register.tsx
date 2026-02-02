import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Link
        to="/"
        className="flex items-center gap-2 text-primary font-semibold text-xl mb-8"
      >
        <Wallet size={32} className="text-primary" />
        FINANCY
      </Link>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900">Criar conta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Comece a controlar suas finanças ainda hoje
        </p>

        <form
          onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
          className="mt-6 space-y-4"
        >
          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome completo"
            icon={<User size={20} />}
            error={errors.name?.message}
            {...register("name")}
          />
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
          <p className="text-xs text-gray-500">
            A senha deve ter no mínimo 8 caracteres
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            Cadastrar
          </Button>
          {registerMutation.isError && (
            <p className="text-sm text-red-500 text-center">
              {(registerMutation.error as Error)?.message ??
                "Erro ao cadastrar"}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-500 text-sm">ou</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link to="/">
            <Button type="button" variant="outline" size="md">
              → Fazer login
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
