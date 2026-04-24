import { projects, getProject } from "@/lib/projects";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectDetailFallback from "./ProjectDetailFallback";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 pb-24 min-h-screen">
        <ProjectDetailFallback project={project} />
      </main>
    </>
  );
}
