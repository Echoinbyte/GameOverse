import { learningTools } from "@/config/constants/learning-tools";
import Header from "@/components/Header";
import CardGrid from "@/components/CardGrid";
import { LearningToolCard, SavedDatasets } from "@/components/home";

export default function HomePage() {
  return (
    <>
      <Header
        title="GameOverse"
        description="Transform your learning journey with interactive tools designed to make education engaging and effective"
        className="mb-16"
      />

      <CardGrid
        items={learningTools}
        renderCard={(tool) => <LearningToolCard key={tool.title} tool={tool} />}
        className="mb-16"
      />

      <SavedDatasets />
    </>
  );
}
