import { useState } from "react";
import {
  Title,
  Stepper,
  Button,
  Group,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  FileInput,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { generatePitchDeck, testApi } from "../api/client";

interface FormData {
  projectName: string;
  address: string;
  investmentType: string;
  purchasePrice: number;
  totalRaise: number;
  targetIrr: string;
  holdPeriod: string;
  description: string;
  sponsorBio: string;
  image: File | null;
  tone: string;
}

export default function CreatePage() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<FormData>({
    initialValues: {
      projectName: "Fletcher Landing Waterfront Estate",
      address: "5482 Fletcher Landing NE, Bainbridge Island, WA 98110",
      investmentType: "Single Family Flip",
      purchasePrice: 4398000,
      totalRaise: 1100000,
      targetIrr: "22%",
      holdPeriod: "3 years",
      description:
        "Stunning single-level waterfront home on Fletcher Bay that lives like a luxury resort. This opulent 3,010 sqft home was rebuilt to the studs in 2018 and features light-filled interiors with exquisite designer finishes, walls of windows showcasing dramatic Puget Sound & Olympic Mountain views, chef's kitchen with Wolf/Subzero appliances, wine room, waterside primary suite, and a private dock. The property offers exceptional outdoor entertaining spaces with tiers of decks cascading down to the water.",
      sponsorBio:
        "John Smith has over 15 years of experience in real estate development and property management. He has successfully completed over $50M in real estate transactions and specializes in luxury waterfront properties and high-end single family renovations.",
      image: null,
      tone: "Professional",
    },
    validate: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: any = {};

      if (active === 0) {
        if (!values.projectName)
          errors.projectName = "Project name is required";
        if (!values.address) errors.address = "Address is required";
        if (!values.investmentType)
          errors.investmentType = "Investment type is required";
      }

      if (active === 1) {
        if (!values.purchasePrice || values.purchasePrice <= 0) {
          errors.purchasePrice = "Purchase price must be greater than 0";
        }
        if (!values.totalRaise || values.totalRaise <= 0) {
          errors.totalRaise = "Total raise must be greater than 0";
        }
        if (!values.targetIrr) errors.targetIrr = "Target IRR is required";
        if (!values.holdPeriod) errors.holdPeriod = "Hold period is required";
      }

      if (active === 2) {
        if (!values.sponsorBio) errors.sponsorBio = "Sponsor bio is required";
      }

      return errors;
    },
  });

  const nextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setActive((current) => Math.min(current + 1, 3));
    }
  };

  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  const handleSubmit = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    setLoading(true);
    try {
      const pitchData = await generatePitchDeck(form.values);
      // Store the data in sessionStorage for the preview page
      sessionStorage.setItem(
        "pitchData",
        JSON.stringify({
          formData: form.values,
          generatedContent: pitchData,
        })
      );
      navigate("/preview");
    } catch (error) {
      console.error("Error generating pitch deck:", error);
      // Handle error - show notification
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async () => {
    try {
      const result = await testApi();
      console.log("API Test Result:", result);
      alert(`API Test Success: ${result.message}`);
    } catch (error) {
      console.error("API Test Error:", error);
      alert(`API Test Failed: ${error}`);
    }
  };
  return (
    <Paper shadow="sm" p="xl" radius="md" maw={800} mx="auto">
      <Stack gap="xl">
        <Title order={1} ta="center" c="indigo">
          Create Your Pitch Deck
        </Title>
        <Group justify="center">
          <Button variant="outline" size="xs" onClick={handleTestApi}>
            Test API Connection
          </Button>
        </Group>
        <Stepper active={active}>
          <Stepper.Step label="Project Details" description="Basic information">
            <Stack gap="md" mt="xl">
              <TextInput
                label="Project Name"
                placeholder="Enter project name"
                {...form.getInputProps("projectName")}
              />
              <TextInput
                label="Address"
                placeholder="Enter property address"
                {...form.getInputProps("address")}
              />
              <Select
                label="Investment Type"
                placeholder="Select investment type"
                data={[
                  "Multifamily",
                  "Single Family Flip",
                  "Commercial",
                  "Development",
                  "Industrial",
                  "Mixed Use",
                ]}
                {...form.getInputProps("investmentType")}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Financial Details"
            description="Investment metrics"
          >
            <Stack gap="md" mt="xl">
              <NumberInput
                label="Purchase Price"
                placeholder="Enter purchase price"
                min={0}
                thousandSeparator=","
                prefix="$"
                {...form.getInputProps("purchasePrice")}
              />
              <NumberInput
                label="Total Raise"
                placeholder="Enter total equity raise amount"
                min={0}
                thousandSeparator=","
                prefix="$"
                {...form.getInputProps("totalRaise")}
              />
              <TextInput
                label="Target IRR"
                placeholder="e.g., 18%"
                {...form.getInputProps("targetIrr")}
              />
              <TextInput
                label="Hold Period"
                placeholder="e.g., 5 years"
                {...form.getInputProps("holdPeriod")}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Additional Info" description="Details and bio">
            <Stack gap="md" mt="xl">
              <Select
                label="AI Content Tone"
                placeholder="Select content tone"
                data={["Professional", "Persuasive", "Data-Driven"]}
                {...form.getInputProps("tone")}
              />
              <Textarea
                label="Project Description (Optional)"
                placeholder="Describe the project, target market, strategy..."
                rows={4}
                {...form.getInputProps("description")}
              />
              <Textarea
                label="Sponsor Bio"
                placeholder="Brief bio of the sponsor/team..."
                rows={4}
                {...form.getInputProps("sponsorBio")}
              />
              <FileInput
                label="Property Image (Optional)"
                placeholder="Upload an image"
                accept="image/*"
                {...form.getInputProps("image")}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack gap="md" mt="xl" align="center">
              <Text size="lg" ta="center">
                Ready to generate your AI-powered pitch deck!
              </Text>
              <Text size="sm" c="dimmed" ta="center" maw={400}>
                Click "Generate Pitch Deck" to create your professional
                presentation
              </Text>
            </Stack>
          </Stepper.Completed>
        </Stepper>
        <Group justify="space-between" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Back
          </Button>

          {active < 3 ? (
            <Button onClick={nextStep}>Next step</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              Generate Pitch Deck
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
