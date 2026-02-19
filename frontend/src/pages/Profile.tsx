import { useState, useEffect } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const updateUser = useUpdateUser();
  const [name, setName] = useState(user?.name ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />
            <Input
              label="E-mail"
              type="email"
              value={user?.email ?? ""}
              icon={Mail}
              disabled
              className="bg-gray-100 cursor-not-allowed"
              helperText="O e-mail não pode ser alterado"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full"
              disabled={
                updateUser.isPending || name.trim() === (user?.name ?? "")
              }
              onClick={() => updateUser.mutate({ name: name.trim() })}
            >
              {updateUser.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={LogOut}
              className="w-full"
              onClick={logout}
            >
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
