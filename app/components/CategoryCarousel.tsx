"use client";

import styles from "./CategoryCarousel.module.css";

type CategoryCarouselProps = {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

const categoryIcons: Record<string, string> = {
  Primo: "🍝",
  Secondo: "🍖",
  Contorno: "🥗",
  Dolce: "🍰",
  Bevanda: "🥤",
  Antipasto: "🍤",
  Pizza: "🍕",
  Pasta: "🍝",
  Carne: "🥩",
  Pesce: "🐟",
  Vegetariano: "🥬",
  Vegano: "🌱",
};

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || "🍽️";
}

export default function CategoryCarousel({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  const handleClick = (category: string) => {
    if (selectedCategory === category) {
      onSelectCategory(null);
    } else {
      onSelectCategory(category);
    }
  };

  return (
    <div className={styles.categoryCarousel}>
      <div className={styles.categoryList}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={`${styles.categoryItem} ${
              selectedCategory === category ? styles.active : ""
            }`}
          >
            <div className={styles.categoryIcon}>
              <span className={styles.categoryIconEmoji}>
                {getCategoryIcon(category)}
              </span>
            </div>
            <span className={styles.categoryName}>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
