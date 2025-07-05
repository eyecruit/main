import { useAuth } from "@/lib/auth";

export function UserGreet() {
  const { user } = useAuth();
  return (
    <div className="pl-6 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Hello {user?.name}</h1>
      <p className="text-sm text-muted-foreground">
        Welcome to your personal dashboard. Here you can manage your interview preparation.
      </p>
    </div>
  )
}