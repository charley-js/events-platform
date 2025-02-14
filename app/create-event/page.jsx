"use client";

import { React, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Center,
  Field,
  FieldRequiredIndicator,
  Stack,
  Button,
  Heading,
  Box,
  Input,
  Textarea,
  FieldErrorText,
} from "@chakra-ui/react";
import * as yup from "yup";

const eventSchema = yup.object({
  title: yup.string().required("Event title is required"),
  description: yup.string().required("Event description is required"),
  date: yup.string().required("Event date is required"),
  category: yup.string().required("Event category is required"),
});

export default function CreateEvent() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
  });
  const [alert, setAlert] = useState({ message: "", status: "" });
  const router = useRouter();

  function handleEventCreate(event) {
    setButtonLoading(true);
    event.preventDefault();
    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      category: eventCategory,
    };
    return eventSchema
      .validate(newEvent, { abortEarly: false })
      .then(() => {
        setErrors({ title: "", description: "", category: "", date: "" });
        return fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Event created successfully") {
          setAlert({ message: "Event created.", status: "success" });
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setAlert({ message: "Error creating event.", status: "error" });
        }
      })
      .catch((err) => {
        if (!err.inner) {
          console.error("Error:", err);
        } else {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        }
      })
      .finally(() => {
        setButtonLoading(false);
      });
  }

  return (
    <Center height={"100vh"}>
      <Stack width={"50%"} align={"center"}>
        {alert.message && (
          <Alert.Root zindex={9999} status={alert.status} top={4}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{alert.status === "error" ? "Error!" : "Success!"}</Alert.Title>
              <Alert.Description>{alert.message}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        <Heading size={"xl"}>Create Event</Heading>
        <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
          <form onSubmit={handleEventCreate} noValidate>
            <Field.Root invalid={!!errors.title} required mb={4}>
              <Field.Label>
                Event Title:
                <FieldRequiredIndicator />
              </Field.Label>
              <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              <FieldErrorText>{errors.title}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.description} required mb={4}>
              <Field.Label>
                Event Description:
                <FieldRequiredIndicator />
              </Field.Label>
              <Textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
              <FieldErrorText>{errors.description}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.date} required mb={4}>
              <Field.Label>
                Event Date:
                <FieldRequiredIndicator />
              </Field.Label>
              <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              <FieldErrorText>{errors.date}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.category} required mb={4}>
              <Field.Label>
                Event Category:
                <FieldRequiredIndicator />
              </Field.Label>
              <Input value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} />
              <FieldErrorText>{errors.category}</FieldErrorText>
            </Field.Root>
            <Button loading={buttonLoading} loadingText={"Creating..."} type={"submit"}>
              Create Event
            </Button>
          </form>
        </Box>
      </Stack>
    </Center>
  );
}
