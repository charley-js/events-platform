"use client";
import { React, useState, useEffect, useContext } from "react";
import { SessionContext } from "../context/SessionContext.js";
import { useRouter } from "next/navigation";
import EventCard from "../components/eventCard.jsx";
import { Heading, Button, SimpleGrid, Box, Flex, Center, Spinner, Container } from "@chakra-ui/react";
import Cookies from "js-cookie";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const { isMod } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  function fetchEvents() {
    if (typeof window !== "undefined") {
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
    <Container>
      <Heading size={"2xl"} textAlign={"center"} flex="1" mb={10}>
        All Events
      </Heading>
      <Center>
        {isMod && (
          <Button loading={buttonLoading} loadingText={"Loading..."} onClick={handleCreateEvent} mb={10}>
            Create Event
          </Button>
        )}
      </Center>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={"30px"}>
        {events.map((event) => (
          <Box key={event._id} display={"flex"} flexDirection={"column"} h={"100%"} paddingBottom={"5"}>
            <EventCard event={event} isMod={isMod} fetchEvents={fetchEvents} />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
