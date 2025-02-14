"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Heading, Box, Stack, Text, HStack, Center, Spinner } from "@chakra-ui/react";
import { Avatar } from "../../components/ui/avatar";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetch(`/api/users?_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));

    fetch(`/api/events?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => {
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" speed="0.8s" />
      </Center>
    );
  }
  return (
    <Box p={6} maxW="800px" mx="auto">
      <Card.Root mb={6} p={6} borderRadius="xl" boxShadow="lg" bg={"gray.950"}>
        <CardBody>
          <HStack mb={4} gap={3}>
            <Avatar size={"2xl"} name={user.username} src="" colorPalette={"blue"} />
            <Stack spacing={1} ml={4}>
              <Heading size="lg">Welcome, {user.username}</Heading>
              <Text color="gray.500">{user.email}</Text>
              <Text color="gray.300" fontSize="sm">
                Attending {user.events ? user.events.length : 0} events
              </Text>
            </Stack>
          </HStack>
        </CardBody>
      </Card.Root>

      <Card.Root p={5} borderRadius="lg" boxShadow="md" bg="gray.950">
        <CardBody>
          <Heading size="md" mb={4}>
            Your Events
          </Heading>
          {events.length > 0 ? (
            events.map((event) => (
              <Card.Root
                key={event._id}
                mb={4}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
                transition="transform 0.2s ease-in-out"
                _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
                borderLeft="6px solid #D52929"
                bg={"gray.900"}
              >
                <CardBody>
                  <Heading size="md" mb={2}>
                    {event.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {event.category}
                  </Text>
                  <Text mt={2}>{event.description}</Text>
                  <Text fontSize="sm" mt={2}>
                    Date: {new Date(event.date).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {event.attendees.length} Attending
                  </Text>
                </CardBody>
              </Card.Root>
            ))
          ) : (
            <Text color="gray.500">No events available.</Text>
          )}
        </CardBody>
      </Card.Root>
    </Box>
  );
}
