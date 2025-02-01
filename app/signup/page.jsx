"use client";
import React, { useState } from "react";
import * as yup from "yup";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  Heading,
  Text,
  Stack,
  Input,
  Button,
  Field,
  FieldRequiredIndicator,
  Center,
  Box,
  Link,
} from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "../../components/ui/password-input";
import { useRouter } from "next/navigation";

const userSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required"),
  googleToken: yup.string().required("Google authentication required"),
});

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  function handleGoogleSuccess(res) {
    setGoogleToken(res.credential);
  }

  function handleGoogleFailure(error) {
    console.error(error);
    alert("Google authentication failed.");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const user = { username, email, password, events: [], googleToken, isMod: false };

    return userSchema
      .validate(user, { abortEarly: false })
      .then(() => {
        setErrors({ username: "", email: "", password: "" });
        return fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "User created successfully") {
          alert("Sign up successful");
          router.push("/login");
        } else {
          alert("Error during Sign up");
        }
      })
      .catch((err) => {
        if (!err.inner) {
          console.error("Error:", err);
        } else {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        }
      });
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Center height={"100vh"}>
        <Stack width={"50%"} align={"center"}>
          <Heading size={"xl"}>Welcome!</Heading>
          <Text mb={4}>Please sign up below</Text>
          <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
            <form onSubmit={handleSubmit}>
              <Field.Root required mb={4}>
                <Field.Label>
                  Enter Username:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={username} onChange={(event) => setUsername(event.target.value)} />
              </Field.Root>
              {errors.username && <p>{errors.username}</p>}
              <Field.Root required mb={4}>
                <Field.Label>
                  Enter Email:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} />
                <Field.HelperText>We will never give out your email address.</Field.HelperText>
              </Field.Root>
              {errors.email && <p>{errors.email}</p>}
              <Field.Root required mb={4}>
                <Field.Label>
                  Enter Password:
                  <FieldRequiredIndicator />
                </Field.Label>
                <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />
                <PasswordStrengthMeter value={password} />
                <Field.HelperText>
                  Requires at least one uppercase letter, one lowercase letter, one number and one special character.
                  Must be at least 8 characters long.
                </Field.HelperText>
              </Field.Root>
              {errors.password && <p>{errors.password}</p>}
              <Box display="flex" justifyContent="center" mb={4}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                  theme="outline"
                  size="medium"
                  style={{ transform: "scale(0.85)" }}
                />
              </Box>
              <Center mb={4}>
                <Button type="submit" disabled={!googleToken}>
                  Sign Up
                </Button>
              </Center>
              <Center>
                <Text align={"center"}>
                  Already have an account?
                  <Link variant={"underline"} colorPalette={"teal"} href="/login">
                    Login
                  </Link>
                  .
                </Text>
              </Center>
            </form>
          </Box>
        </Stack>
      </Center>
    </GoogleOAuthProvider>
  );
}
