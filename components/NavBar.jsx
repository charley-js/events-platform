"use client";
import { usePathname } from "next/navigation";
import { Box, Flex, Link, Text, Button } from "@chakra-ui/react";
import { Avatar, AvatarGroup } from "../components/ui/avatar";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const username = localStorage.getItem("username");

  function handleClick() {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isMod");
    router.push("/login");
  }

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <Box bg="teal" px={4} py={3} mb={4}>
      <Flex justify={"space-between"} align="center" width="100%">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Events Platform
        </Text>
        <Flex gap={10} justify="center" align="center" flex="1">
          <Link as={NextLink} href="/events" color="white">
            Events
          </Link>
        </Flex>
        <Flex align="center" gap={4}>
          <Link as={NextLink} href="/">
            <AvatarGroup size="md">
              <Avatar name={username} />
            </AvatarGroup>
          </Link>
          <Button onClick={handleClick} variant="outline" color="white">
            Log Out
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
