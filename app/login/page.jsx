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
  Spinner,
  FieldErrorText,
  Alert,
  Image,
} from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import Cookies from "js-cookie";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ message: "", status: "" });
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      console.log("response from googleLogin:", res.access_token);
      setAccessToken(res.access_token);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      setAlert({ message: "Authentication failed.", status: "error" });
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  function handleSubmit(event) {
    setButtonLoading(true);
    event.preventDefault();
    const details = { username, password, accessToken };
    console.log("details sent to /auth: ", details);
    setErrors({ username: "", password: "" });
    if (!username) {
      setErrors((prev) => ({
        ...prev,
        username: "Username is required",
      }));
    }
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    }

    if (!username || !password) {
      setButtonLoading(false);
      return;
    }
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
          Cookies.set("userId", data.userId, { expires: 7 });
          Cookies.set("username", data.username, { expires: 7 });
          Cookies.set("accessToken", data.accessToken, { expires: 7 });
          Cookies.set("isMod", data.isMod, { expires: 7 });
          setAlert({ message: "Logged in succesfully.", status: "success" });
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else if (data.message === "Invalid username or password") {
          setErrors({
            username: "Incorrect username or password",
            password: "Incorrect username or password",
          });
        } else {
          setAlert({ message: "Error during login.", status: "error" });
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        setButtonLoading(false);
      });
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Center height={"100vh"} alignItems="flex-start" pt={10}>
        <Stack width={"50%"} align={"center"}>
          <Image mb={"12"} width={"85%"} src="/schedulo-logo.svg" mt={"8"} />
          {alert.message && (
            <Alert.Root zindex={9999} status={alert.status} top={4}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{alert.status === "error" ? "Error!" : "Success!"}</Alert.Title>
                <Alert.Description>{alert.message}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
          <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"} mt={"6"} bg={"gray.950"}>
            <Heading textAlign={"center"} mb={"6"}>
              Log In
            </Heading>
            <form onSubmit={handleSubmit} noValidate>
              <Field.Root invalid={!!errors.username} required mb={4}>
                <Field.Label>
                  Username:
                  <FieldRequiredIndicator />
                </Field.Label>
                <Input value={username} onChange={(event) => setUsername(event.target.value)} />
                <FieldErrorText>{errors.username}</FieldErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors.password} required mb={4}>
                <Field.Label>
                  Enter Password:
                  <FieldRequiredIndicator />
                </Field.Label>
                <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />
                <FieldErrorText>{errors.password}</FieldErrorText>
              </Field.Root>
              <Center>
                <ButtonGroup mb={4}>
                  {accessToken ? (
                    <Button disabled>✅ Google Authenticated</Button>
                  ) : (
                    <Button loadingText={"Authenticating..."} onClick={() => googleLogin()}>
                      Authenticate with Google
                    </Button>
                  )}

                  <Button
                    loading={buttonLoading}
                    colorPalette={"red"}
                    loadingText={"Logging in..."}
                    type="submit"
                    disabled={!accessToken}
                  >
                    Log In
                  </Button>
                </ButtonGroup>
              </Center>
              <Center>
                <Text align={"center"}>
                  Don't have an account yet?
                  <Link colorPalette={"red"} variant="underline" href="/signup" ml={1}>
                    Sign up.
                  </Link>
                </Text>
              </Center>
            </form>
          </Box>
        </Stack>
      </Center>
    </GoogleOAuthProvider>
  );
}
