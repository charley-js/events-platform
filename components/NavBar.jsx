"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Flex, Link, Text, Button, Image } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../components/ui/avatar";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUsername = Cookies.get("username");
        setUsername(storedUsername);
      } catch (error) {
        console.error("Error accessing Cookie.", error);
        setUsername(null);
      }
    }
  }, []);

  function handleClick() {
    Cookies.remove("userId");
    Cookies.remove("accessToken");
    Cookies.remove("isMod");
    router.push("/login");
  }

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
            href="/events"
            color="white"
            textDecoration={"underline"}
            _hover={{ color: "red" }}
          >
            Events
          </Link>
        </Flex>
        <Flex justify="flex-end" flex="1" gap={4}>
          <Link as={NextLink} href="/">
            <AvatarGroup size="md">
              <Avatar name={username} />
            </AvatarGroup>
          </Link>
          <Button onClick={handleClick} colorPalette={"red"}>
            Log Out
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
