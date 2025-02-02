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
import zxcvbn from "zxcvbn";
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [googleToken, setGoogleToken] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);
  const router = useRouter();

  function handlePassword(event) {
    setPassword(event.target.value);
    const strength = zxcvbn(event.target.value).score;
    setPasswordStrength(strength);
  }
  function handleGoogleSuccess(res) {
    setGoogleToken(res.credential);
    setGoogleSuccess(true);
  }

  function handleGoogleFailure(error) {
    console.error(error);
    alert("Google authentication failed.");
  }

  function handleSubmit(event) {
    setButtonLoading(true);
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
        } else if (data.message === "User already exists") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: "Username is taken, try something else.",
          }));
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
      })
      .finally(() => {
        setButtonLoading(false);
      });
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Center height={"100vh"}>
        <Stack width={"50%"} align={"center"}>
          <Heading size={"xl"}>Welcome!</Heading>
          <Text mb={4}>Please sign up below</Text>
          <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
            <form onSubmit={handleSubmit} noValidate>
              <Field.Root invalid={!!errors.username} required mb={4}>
                <Field.Label>
                  Enter Username:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={username} onChange={(event) => setUsername(event.target.value)} />
                <Field.ErrorText>{errors.username}</Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors.email} required mb={4}>
                <Field.Label>
                  Enter Email:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
                <Field.HelperText>We will never give out your email address.</Field.HelperText>
              </Field.Root>
              <Field.Root invalid={!!errors.password} required mb={4}>
                <Field.Label>
                  Enter Password:
                  <FieldRequiredIndicator />
                </Field.Label>
                <PasswordInput value={password} onChange={handlePassword} />
                <Field.ErrorText>{errors.password}</Field.ErrorText>
                <PasswordStrengthMeter value={passwordStrength} />
                <Field.HelperText>
                  Requires at least one uppercase letter, one lowercase letter, one number and one special character.
                  Must be at least 8 characters long.
                </Field.HelperText>
              </Field.Root>
              <Box display="flex" justifyContent="center" mb={4}>
                {googleSuccess ? (
                  <Button disabled>✅ Google Authenticated</Button>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    render={(renderProps) => (
                      <Button onClick={renderProps.onClick} disabled={googleLoginSuccess}>
                        Continue with Google
                      </Button>
                    )}
                  />
                )}
              </Box>
              <Center mb={4}>
                <Button type="submit" disabled={!googleToken} loading={buttonLoading} loadingText={"Signing up..."}>
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
