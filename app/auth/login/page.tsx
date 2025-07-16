"use client";

import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import React, { useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { isSameOrigin } from "@/app/lib/security";

export default function Login() {
  const searchParams = useSearchParams()

  const [incorrectAttempt, setIncorrectAttempt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (result?.ok) {
      const nextPath = searchParams.get("next");

      if (nextPath && isSameOrigin(nextPath)) {
        redirect(nextPath);
      } else {
        redirect("/characters");
      }

    } else {
      setIncorrectAttempt(true);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
            </CardHeader>

            <CardContent>

              {incorrectAttempt &&
                <Alert className="mb-4" variant="destructive">
                  <AlertTitle>Incorrect username or password</AlertTitle>
                </Alert>
              }

              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      Login
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  )
}
