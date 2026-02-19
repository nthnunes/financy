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
        <CardContent className="p-8 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-5 border-b border-gray-200 pb-8">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium text-gray-800">
              {initials}
            </div>
            <div className="flex flex-col gap-0.5 text-center">
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
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

          <div className="flex flex-col gap-4">
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
              iconClassName="text-danger"
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
