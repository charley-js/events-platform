"use client";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../../components/EventCard";
import { Heading, Button, SimpleGrid, Box, Flex } from "@chakra-ui/react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isMod, setIsMod] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const userIsMod = localStorage.getItem("isMod");
    if (userIsMod === "true") {
      setIsMod(true);
    }
    fetch("/api/events").then((res) => {
      return res.json().then((data) => {
        setEvents(data);
      });
    });
  }, []);

  function handleCreateEvent() {
    router.push("/create-event");
  }

  return (
    <div>
      <Flex justify="center" align="center" mb={8}>
        <Heading size={"2xl"} textAlign={"center"} flex="1">
          All Events
        </Heading>
        {isMod && (
          <Button onClick={handleCreateEvent} ml="auto" right={"8"}>
            Create Event
          </Button>
        )}
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {events.map((event) => (
          <Box key={event._id}>
            <EventCard event={event} isMod={isMod} />
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
}
