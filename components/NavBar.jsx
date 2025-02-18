"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Flex, Link, Text, Button, Image, IconButton } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../components/ui/avatar";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { username, logout } = useContext(SessionContext);
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [logoutButtonLoading, setLogoutButtonLoading] = useState(false);
  const [open, setOpen] = useState(false);

  if (pathname === "/login" || pathname === "/signup") return null;

  function handleLogin() {
    setLoginButtonLoading(true);
    router.push("/login");
    setLoginButtonLoading(false);
  }

  function handleLogout() {
    setLogoutButtonLoading(true);
    logout();
    setLogoutButtonLoading(false);
    setLoginButtonLoading(false);
    router.push("/");
  }

  return (
    <Box px={4} py={3} mb={14}>
      <Flex justify={"space-between"} align="center" width="100%" p={4}>
        <Flex justify="flex-start" align="center" flex="1">
          <Image width={{ base: "150px", xl: "250px" }} src="/schedulo-logo.svg" ml={0} minWidth="100px" />
        </Flex>
        <Flex gap={10} justify="center" align="center" flex="1" display={{ base: "none", md: "flex" }}>
          <Link
            fontSize={{ base: "18px", xl: "28px" }}
            as={NextLink}
            href="/"
            color="white"
            textDecoration={"underline"}
            _hover={{ color: "red" }}
          >
            Events
          </Link>
        </Flex>
        {username && (
          <Flex justify="flex-end" flex="1" gap={4} display={{ base: "none", md: "flex" }}>
            <Link as={NextLink} href="/dashboard">
              <AvatarGroup size="md">
                <Avatar name={username} />
              </AvatarGroup>
            </Link>
            <Button
              loading={logoutButtonLoading}
              loadingText={"Logging Out..."}
              onClick={handleLogout}
              colorPalette={"red"}
            >
              Log Out
            </Button>
          </Flex>
        )}
        {!username && (
          <Flex justify="flex-end" flex="1" gap={4} display={{ base: "none", md: "flex" }}>
            <Button
              colorPalette={"red"}
              onClick={handleLogin}
              loading={loginButtonLoading}
              loadingText={"Logging In..."}
            >
              Log In
            </Button>
          </Flex>
        )}
        <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DrawerBackdrop />
          <DrawerTrigger asChild>
            <IconButton aria-label="Open menu" display={{ base: "flex", md: "none" }} colorPalette={"red"}></IconButton>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <Flex direction="column" gap={6} align="center">
                <Link as={NextLink} href="/" fontSize="lg" _hover={{ color: "red.300" }} onClick={() => setOpen(false)}>
                  All Events
                </Link>
                {username ? (
                  <>
                    <Link as={NextLink} href="/dashboard" fontSize="lg" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                    <Button
                      isLoading={logoutButtonLoading}
                      loadingText="Logging Out..."
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      colorScheme="red"
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="red" as={NextLink} href="/login" onClick={() => setOpen(false)}>
                    Log In
                  </Button>
                )}
              </Flex>
            </DrawerBody>
            <DrawerFooter>
              <DrawerCloseTrigger asChild>
                <Button variant="outline">Close</Button>
              </DrawerCloseTrigger>
            </DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
      </Flex>
    </Box>
  );
}
