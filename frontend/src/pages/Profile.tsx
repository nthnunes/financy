import { User, Mail, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Perfil</h1>
      <p className="text-gray-500 mb-6">Gerencie suas informações</p>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nome completo"
              value={user?.name ?? ""}
              icon={<User size={20} />}
              readOnly
              className="bg-gray-100 cursor-default"
            />
            <Input
              label="E-mail"
              type="email"
              value={user?.email ?? ""}
              icon={<Mail size={20} />}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              O e-mail não pode ser alterado
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full border-danger text-danger hover:bg-danger/10 hover:border-danger"
              onClick={logout}
            >
              <LogOut size={20} className="mr-2" />
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
