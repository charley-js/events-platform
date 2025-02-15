"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Flex, Link, Text, Button, Image } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../components/ui/avatar";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { username, logout } = useContext(SessionContext);

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <Box px={4} py={3} mb={14}>
      <Flex justify={"space-between"} align="center" width="100%">
        <Flex justify="flex-start" align="center" flex="1">
          <Image width="500px" src="/schedulo-logo.svg" ml={0} />
        </Flex>
        <Flex gap={10} justify="center" align="center" flex="1">
          <Link
            fontSize={"2xl"}
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
          <Flex justify="flex-end" flex="1" gap={4}>
            <Link as={NextLink} href="/dashboard">
              <AvatarGroup size="md">
                <Avatar name={username} />
              </AvatarGroup>
            </Link>
            <Button onClick={logout} colorPalette={"red"}>
              Log Out
            </Button>
          </Flex>
        )}
        {!username && (
          <Flex justify="flex-end" flex="1" gap={4}>
            <Button colorPalette={"red"}>
              <Link color={"white"} as={NextLink} href="/login">
                Log In
              </Link>
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
