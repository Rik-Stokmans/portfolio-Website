import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectGrid />
      </main>
    </>
  );
}
