import { Star, Trophy, Users, Zap } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Trophy,
      label: "Courts Available",
      value: "8",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "Active Members",
      value: "2,500+",
      color: "text-green-600",
    },
    {
      icon: Star,
      label: "Expert Coaches",
      value: "12",
      color: "text-yellow-600",
    },
    {
      icon: Zap,
      label: "Years Experience",
      value: "15+",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="my-16 grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="group text-center">
          <div className="bg-secondary group-hover:bg-secondary-foreground mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full transition-colors">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-slate-200">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export { Stats };
