import { useContext } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

import useSignup from "../api/useSignup";
import useGoogleSignUp from "../api/useGoogleSignUp";
import { AuthContext } from "../providers/authProvider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string(),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(15, "Password must be at most 15 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.confirmPassword) {
      context.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

const Signup = () => {
  const googleSignupMutation = useGoogleSignUp();
  const form = useForm({
    resolver: zodResolver(signupSchema),
  });
  const login = useGoogleLogin({
    onSuccess: (response) => {
      googleSignupMutation.mutate(
        {
          tokenId: response.access_token,
        },
        {
          onSuccess: (data) => {
            setToken(data.accessToken);
            toast.success("Signup successful");
            navigate("/");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Signup failed");
          },
        }
      );
    },
  });
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const signupMutation = useSignup();

  const handleSubmit = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (data) => {
        setToken(data.accessToken);
        toast.success("Signup successful");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Signup failed");
      },
    });
  };

  return (
    <div className="max-w-[600px] p-3 mt-4 mx-auto">
      <p className=" font-bold text-blue-500 text-2xl">Signup</p>
      <div className="mt-1 border-solid border-2 border-blue-500 rounded p-4 shadow-md">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" variant="secondary">
              Signup
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center gap-3 mt-3">
          <p className="text-sm font-semibold">
            Already having an account?{" "}
            <Link className="text-blue-500 ml-2" to="/login">
              Login
            </Link>
          </p>
          <Button size="sm" variant="secondary" onClick={login}>
            Signup with <span className="font-bold ml-2">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
