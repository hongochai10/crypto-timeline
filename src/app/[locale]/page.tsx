import { Suspense } from "react";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <main className="relative">
      <Suspense>
        <Timeline />
      </Suspense>
    </main>
  );
}
