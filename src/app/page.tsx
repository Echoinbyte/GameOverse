import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import { learningTools } from "@/config/constants/learning-tools";

export default function HomePage() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
            GameOverse
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transform your learning journey with interactive tools designed to
            make education engaging and effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {learningTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.title}
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
          })}
        </div>
      </div>
    </div>
  );
}
