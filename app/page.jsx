"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Heading, Box, Stack, Text, HStack } from "@chakra-ui/react";
import { Avatar } from "../components/ui/avatar";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (!userId || !accessToken) {
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

  if (loading) return <p>Loading...</p>;
  return (
    <Box p={6} maxW="800px" mx="auto">
      <Card.Root mb={6} p={4} borderRadius="lg" boxShadow="md">
        <CardBody>
          <HStack mb={4} gap={3}>
            <Avatar name={user.username} src="" />
            <Stack>
              <Heading size="lg">Welcome, {user.username}</Heading>
              <Text color="gray.500">{user.email}</Text>
            </Stack>
          </HStack>
        </CardBody>
      </Card.Root>

      <Heading size="md" mb={4}>
        Your Events
      </Heading>
      {events.length > 0 ? (
        events.map((event) => (
          <Card.Root key={event._id} mb={4} p={4} borderRadius="lg" boxShadow="sm">
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
        <Text>No events available.</Text>
      )}
    </Box>
  );
}
