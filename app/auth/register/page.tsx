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
import { Alert, AlertTitle } from "@/app/components/ui/alert"
import React, { FormEvent, useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { isSameOrigin } from "@/app/lib/security";
import { signUp } from "./action";
import { signIn } from "next-auth/react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const searchParams = useSearchParams();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    const formData = new FormData(e.currentTarget);

    const username = String(formData.get("username")) || "";
    const password = String(formData.get("password")) || "";

    const signUpResult = await signUp(username, password);

    if (signUpResult) {
      setErrorText(signUpResult)
      setIsError(true)
      setIsLoading(false)
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.ok) {
      const nextPath = searchParams.get("next");

      if (nextPath && isSameOrigin(nextPath)) {
        redirect(nextPath);
      } else {
        redirect("/characters");
      }

    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Register a new account</CardTitle>
            </CardHeader>

            <CardContent>

              {isError &&
                <Alert className="mb-4" variant="destructive">
                  <AlertTitle>{errorText}</AlertTitle>
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
                      Register
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Have an account?{" "}
                  <a href={`/auth/login?next=${searchParams.get("next") || ""}`} className="underline underline-offset-4">
                    Login
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
