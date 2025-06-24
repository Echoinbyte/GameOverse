import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LearningTool } from "@/types";

interface LearningToolCardProps {
  tool: LearningTool;
}

export default function LearningToolCard({ tool }: LearningToolCardProps) {
  const IconComponent = tool.icon;

  return (
    <Link
      href={tool.slug}
      className="group block transform transition-all duration-500 hover:scale-105"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 p-8 h-full relative overflow-hidden group-hover:shadow-2xl">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-8 mx-auto shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
          <IconComponent className="w-8 h-8 text-white relative z-10" />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
            {tool.title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 group-hover:text-slate-200 transition-colors duration-300">
            {tool.description}
          </p>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm text-white font-semibold">
              Start Learning
            </span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
