interface StatsCardProps {
  title: string;
  value: string | number;
  iconSrc: string; // Path to the SVG icon image
}

function StatsCard({ title, value, iconSrc }: StatsCardProps) {
  return (
    <div className="relative bg-white rounded-xl p-8 min-h-32 shadow-sm">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      
      <div className="absolute bottom-2 right-4">
        <img src={iconSrc} alt={`${title} icon`} className="h-19 w-19" />
      </div>
    </div>
  );
}

export default StatsCard;
