"use client";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Text,
  Stack,
  Input,
  Center,
  Box,
  Button,
  ButtonGroup,
  Field,
  FieldRequiredIndicator,
  Link,
} from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      setAccessToken(res.access_token);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      alert("Google login failed");
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  function handleSubmit(event) {
    event.preventDefault();
    const details = { username, password, accessToken };
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Authentication successful") {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("isMod", data.isMod);
          alert("Logged in succesfully");
          router.push("/");
        } else {
          alert("Error during login");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Center height={"100vh"}>
        <Stack width={"50%"} align={"center"}>
          <Heading size={"xl"}>Welcome!</Heading>
          <Text mb={4}>Please login below</Text>
          <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
            <form onSubmit={handleSubmit}>
              <Field.Root required mb={4}>
                <Field.Label>
                  Username:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={username} onChange={(event) => setUsername(event.target.value)} />
              </Field.Root>
              <Field.Root required mb={4}>
                <Field.Label>
                  Enter Password:
                  <FieldRequiredIndicator />
                </Field.Label>
                <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />
              </Field.Root>
              <ButtonGroup mb={4}>
                <Button onClick={() => googleLogin()}>Sign in with Google</Button>
                <Button type="submit" disabled={!accessToken}>
                  Log In
                </Button>
              </ButtonGroup>

              <Text align={"center"}>
                Don't have an account yet?{" "}
                <Link colorPalette={"teal"} variant="underline" href="/signup">
                  Sign up.
                </Link>
              </Text>
            </form>
          </Box>
        </Stack>
      </Center>
    </GoogleOAuthProvider>
  );
}
