"use client";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../../components/EventCard";
import { Heading, Button, SimpleGrid, Box, Flex, Center, Spinner } from "@chakra-ui/react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isMod, setIsMod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  function fetchEvents() {
    const userIsMod = localStorage.getItem("isMod");
    if (userIsMod === "true") {
      setIsMod(true);
    }
    fetch("/api/events").then((res) => {
      return res
        .json()
        .then((data) => {
          setEvents(data);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleCreateEvent() {
    setButtonLoading(true);
    router.push("/create-event");
  }

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" speed="0.8s" />
      </Center>
    );
  }

  return (
    <div>
      <Flex justify="center" align="center" mb={8}>
        <Heading size={"2xl"} textAlign={"center"} flex="1">
          All Events
        </Heading>
        {isMod && (
          <Button loading={buttonLoading} loadingText={"Loading..."} onClick={handleCreateEvent} ml="auto" right={"8"}>
            Create Event
          </Button>
        )}
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {events.map((event) => (
          <Box key={event._id}>
            <EventCard event={event} isMod={isMod} fetchEvents={fetchEvents} />
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
}
