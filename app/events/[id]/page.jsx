"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Center, Box, Heading, Text, Spinner, Button } from "@chakra-ui/react";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events?_id=${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!event) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Text fontSize="xl">Event not found</Text>
      </Center>
    );
  }

  const attendeesCount = event.attendees ? event.attendees.length : 0;

  return (
    <Center height="100vh">
      <Box width="60%" p={8} boxShadow="lg" borderRadius="lg">
        <Heading mb={4}>{event.title}</Heading>
        <Text fontSize="lg" mb={2}>
          {event.description}
        </Text>
        <Text fontWeight="bold">Date: {new Date(event.date).toLocaleString()}</Text>
        <Text fontWeight="bold">Category: {event.category}</Text>
        <Text fontWeight="bold">Attendees: {attendeesCount}</Text>
      </Box>
    </Center>
  );
}
