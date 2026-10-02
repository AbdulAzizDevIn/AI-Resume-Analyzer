"use client";

import { FileText, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.data) {
      router.push("/sign-in");
    } else {
      alert("Error signing out");
    }
  };

  return (
    <>
      <header  className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <FileText className="h-5 w-5 text-indigo-600" strokeWidth={1.7} />

              <span className="absolute -bottom-1 -right-1 rounded-[4px] bg-black px-1 py-0.5 text-[7px] font-bold leading-none text-white">
                AI
              </span>
            </div>

            <span className="text-base font-semibold tracking-[-0.03em] sm:text-lg">
              AI Resume Analyzer
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
            {session?.user ? (
              <>
                <Link
                  href={"/dashboard"}
                  className="rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Dashboard
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      />
                    }
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {session?.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-60">
                    <div className="px-3 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden text-sm font-medium text-gray-900 transition-colors hover:text-indigo-600 sm:block"
                >
                  Login
                </Link>

                <Button
                  asChild
                  className="h-10 rounded-[9px] bg-black px-4 text-sm font-semibold text-white hover:bg-gray-800 sm:px-5"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
