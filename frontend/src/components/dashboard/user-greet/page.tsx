'use client';

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { IoHappy, IoSunny, IoMoon } from "react-icons/io5";

export function UserGreet() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    let greet = "";
    if (hour >= 5 && hour < 12) greet = "🌅 Good morning";
    else if (hour >= 12 && hour < 17) greet = "🌞 Good Afternoon";
    else if (hour >= 17 && hour < 21) greet = "🌃 Good Evening";
    else greet = "🌙 Up till now ? ";

    setGreeting(greet);
  }, []);

  return (
    <div className="pl-6 flex flex-col gap-1 md:gap-2">
      <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
        {greeting} {user?.name} 
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Welcome to your personal dashboard. 🚀 Start managing your interview prep smartly and stay ahead! 💼
      </p>
    </div>
  );
}
