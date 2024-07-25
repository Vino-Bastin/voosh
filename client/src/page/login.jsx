import { useContext } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

import useLogin from "../api/useLogin";
import useGoogleLoginApi from "../api/useGoogleLogin";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15, "Password must be at most 15 characters"),
});

const Login = () => {
  const googleLoginMutation = useGoogleLoginApi();
  const login = useGoogleLogin({
    onSuccess: (response) => {
      googleLoginMutation.mutate(
        {
          tokenId: response.access_token,
        },
        {
          onSuccess: (data) => {
            setToken(data.accessToken);
            toast.success("Login successful");
            navigate("/");
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed");
          },
        }
      );
    },
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { setToken } = useContext(AuthContext);

  const handleSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setToken(data.accessToken);
        toast.success("Login successful");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="max-w-[600px] p-3 mt-4 mx-auto">
      <p className=" font-bold text-blue-500 text-2xl">Login</p>
      <div className="mt-1 border-solid border-2 border-blue-500 rounded p-4 shadow-md">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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
            <Button className="w-full" variant="secondary">
              Login
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center gap-3 mt-3">
          <p className="text-sm font-semibold">
            Don&apos;t have an account?
            <Link className="text-blue-500 ml-2" to="/signup">
              Signup
            </Link>
          </p>
          <Button size="sm" variant="secondary" onClick={login}>
            Login with <span className="font-bold ml-2">Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
