"use client";

import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryCarousel from "../components/CategoryCarousel";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";

export default function DemoPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ["Primo", "Secondo", "Contorno", "Dolce", "Bevanda"];

  const mockProducts = [
    {
      uuid: "1",
      nome: "Spaghetti Carbonara",
      descrizione: "Pasta con guanciale, uova e pecorino romano",
      prezzo: 12.5,
      tipologia: "Primo",
    },
    {
      uuid: "2",
      nome: "Bistecca alla Fiorentina",
      descrizione: "Carne di manzo cotta alla griglia",
      prezzo: 28.0,
      tipologia: "Secondo",
    },
    {
      uuid: "3",
      nome: "Insalata Mista",
      descrizione: "Verdure fresche di stagione",
      prezzo: 6.5,
      tipologia: "Contorno",
    },
    {
      uuid: "4",
      nome: "Tiramisù",
      descrizione: "Dolce al caffè con mascarpone",
      prezzo: 7.0,
      tipologia: "Dolce",
    },
    {
      uuid: "5",
      nome: "Acqua Naturale",
      descrizione: "Bottiglia 75cl",
      prezzo: 2.5,
      tipologia: "Bevanda",
    },
  ];

  const updateQuantity = (uuid: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[uuid] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [uuid]: newVal };
    });
  };

  const filteredProducts = selectedCategory
    ? mockProducts.filter((p) => p.tipologia === selectedCategory)
    : mockProducts;

  const calculateTotal = () => {
    return mockProducts.reduce((total, product) => {
      const quantity = quantities[product.uuid] || 0;
      return total + product.prezzo * quantity;
    }, 0);
  };

  return (
    <>
      <Header title="Menù" showBackButton={false} />

      <div
        className="pb-32"
        style={{ backgroundColor: "var(--color-gray-50)", minHeight: "100vh" }}
      >
        <div className="pt-4 pb-2">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={() => console.log("Search:", searchValue)}
            placeholder="Cerca un piatto o una categoria"
            loading={false}
          />
        </div>

        <CategoryCarousel
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="px-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Ristorante Demo
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Piatti</h3>

            <div className="flex flex-col gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.uuid}
                  uuid={product.uuid}
                  nome={product.nome}
                  descrizione={product.descrizione}
                  prezzo={product.prezzo}
                  quantity={quantities[product.uuid] || 0}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {calculateTotal() > 0 && (
        <div
          className="fixed left-0 right-0 bg-white border-t shadow-lg p-4"
          style={{
            bottom: "4rem",
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 30,
          }}
        >
          <div className="max-w-md mx-auto flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-900">Totale:</span>
            <div className="flex items-center gap-3">
              <span
                className="font-bold text-xl"
                style={{ color: "var(--color-secondary)" }}
              >
                €{calculateTotal().toFixed(2)}
              </span>
              <button
                style={{
                  backgroundColor: "var(--color-secondary)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "var(--radius-lg)",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                Ordina
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="menu" />
    </>
  );
}
