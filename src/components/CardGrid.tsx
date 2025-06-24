import React from "react";

interface CardGridProps<T> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  className?: string;
  gridClassName?: string;
}

export default function CardGrid<T>({
  items,
  renderCard,
  className = "",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
}: CardGridProps<T>) {
  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <div className={gridClassName}>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderCard(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
