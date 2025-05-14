import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  const [role, setRole] = useState<"admin" | "user">("user");
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isAuthenticated()) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 bg-white dark:bg-background rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-2 self-center font-medium">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground mb-2">
            <span className="font-bold text-lg">EM</span>
          </div>
          <span className="text-lg font-semibold">Electric Mind</span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Select Role</Label>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as "admin" | "user")}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full mt-2"
          onClick={() => {
            auth.login(role);
            navigate("/", { replace: true });
          }}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}
