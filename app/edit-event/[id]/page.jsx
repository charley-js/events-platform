"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Alert,
  Center,
  Field,
  Stack,
  Button,
  Heading,
  Box,
  Input,
  Textarea,
  Spinner,
  FieldErrorText,
} from "@chakra-ui/react";
import * as yup from "yup";

const eventUpdateSchema = yup.object({
  title: yup.string().required("Event title is required"),
  description: yup.string().required("Event description is required"),
  date: yup.string().required("Event date is required"),
  category: yup.string().required("Event category is required"),
  venue: yup.string().required("Event venue is required"),
  imageUrl: yup.string(),
});

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();
  const [eventInfo, setEventInfo] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    venue: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "", date: "", category: "", venue: "", imageUrl: "" });
  const [alert, setAlert] = useState({ message: "", status: "" });
  useEffect(() => {
    fetch(`/api/events?_id=${eventId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEventInfo({
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category,
          venue: data.venue,
          imageUrl: data.imageUrl,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setEventInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    setButtonLoading(true);
    event.preventDefault();
    eventUpdateSchema
      .validate(eventInfo, { abortEarly: false })
      .then(() => {
        return fetch(`/api/events?_id=${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventInfo),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event updated successfully") {
          setAlert({ message: "Event updated succesfully.", status: "success" });
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setAlert({ message: "Failed to update event.", status: "error" });
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

  if (loading) {
    return (
      <Center height={"100vh"} width={"100%"}>
        <Spinner size="xl" speed="0.8s" />
      </Center>
    );
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

        <Box width={"50%"} p={8} boxShadow="lg" borderRadius="lg" borderColor={"white"}>
          <Heading size={"xl"} textAlign={"center"} mb={6}>
            Edit Event
          </Heading>
          <form onSubmit={handleSubmit} noValidate>
            <Field.Root invalid={!!errors.title} mb={4}>
              <Field.Label>Event Title:</Field.Label>
              <Input value={eventInfo.title} onChange={handleChange} name={"title"} />
              <FieldErrorText>{errors.title}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.description} mb={4}>
              <Field.Label>Event Description:</Field.Label>
              <Textarea value={eventInfo.description} onChange={handleChange} name={"description"} />
              <FieldErrorText>{errors.description}</FieldErrorText>
            </Field.Root>
            <Field.Root mb={4}>
              <Field.Label>Event Image URL:</Field.Label>
              <Input value={eventInfo.imageUrl} onChange={handleChange} name={"imageUrl"} />
            </Field.Root>
            <Field.Root invalid={!!errors.venue} mb={4}>
              <Field.Label>Event Venue:</Field.Label>
              <Input value={eventInfo.venue} onChange={handleChange} name={"venue"} />
              <FieldErrorText>{errors.venue}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.date} mb={4}>
              <Field.Label>Event Date:</Field.Label>
              <Input type="datetime-local" value={eventInfo.date} onChange={handleChange} name={"date"} />
              <FieldErrorText>{errors.date}</FieldErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.category} mb={4}>
              <Field.Label>Event Category:</Field.Label>
              <Input value={eventInfo.category} onChange={handleChange} name={"category"} />
              <FieldErrorText>{errors.category}</FieldErrorText>
            </Field.Root>
            <Center>
              <Button loading={buttonLoading} loadingText="Saving..." type={"submit"} colorPalette={"red"} mt={4}>
                Edit Event
              </Button>
            </Center>
          </form>
        </Box>
      </Stack>
    </Center>
  );
}
