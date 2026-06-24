import { createFileRoute } from "@tanstack/react-router";
import { BookingCalendar } from "@/components/BookingCalendar";

export const Route = createFileRoute("/boka")({
  head: () => ({
    meta: [
      { title: "Boka tid – Tassa in!" },
      {
        name: "description",
        content: "Boka en tid för djurvård hos Tassa in!",
      },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <BookingCalendar />
      </div>
    </div>
  );
}
