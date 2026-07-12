import { createFileRoute } from "@tanstack/react-router";
import RoyalDentalLanding from "@/components/RoyalDentalLanding";

export const Route = createFileRoute("/")({
  component: RoyalDentalLanding,
});
