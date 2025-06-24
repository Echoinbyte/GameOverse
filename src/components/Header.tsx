interface HeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export default function Header({
  title,
  description,
  icon: Icon,
  className = "",
}: HeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {Icon ? (
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      ) : (
        <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
          {title}
        </h1>
      )}
      <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
