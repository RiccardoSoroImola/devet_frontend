"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useRestaurantUrl } from "../hooks/useRestaurantUrl";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryCarousel from "../components/CategoryCarousel";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";

type MenuItem = {
  uuid: string;
  nome: string;
  tipologia: string;
  descrizione: string;
  prezzo: number;
};

type MenuSezione = {
  uuid: string;
  nome: string;
  menu_items: MenuItem[];
};

type Menu = {
  uuid: string;
  menu_sezioni: MenuSezione[];
};

type Locale = {
  nome_locale: string;
  menu: Menu[];
  uuid?: string; // Optional: se il database ha un campo UUID per i locali
};

type Data = {
  locali: Locale[];
};

function MenuContent() {
  const router = useRouter();
  const { readId, saveId } = useRestaurantUrl();
  const [nomeLocale, setNomeLocale] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const updateQuantity = (uuid: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[uuid] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [uuid]: newVal };
    });
  };

  // Funzione per caricare il menu di un ristorante
  const fetchMenu = async (restaurantName?: string) => {
    const nameToFetch = restaurantName || nomeLocale;
    if (!nameToFetch) return;

    setLoading(true);
    setError(null);

    const query = `
      query GetMenuItemsByLocale($nomeLocale: String!) {
        locali(where: {nome_locale: {_eq: $nomeLocale}}) {
          nome_locale
          menu {
            uuid
            menu_sezioni {
              uuid
              nome
              menu_items {
                uuid
                nome
                tipologia
                descrizione
                prezzo
              }
            }
          }
        }
      }
    `;

    try {
      const hasuraUrl = process.env.NEXT_PUBLIC_HASURA_URL || "https://safe-macaque-83.hasura.app/v1/graphql";
      const hasuraSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET || "";
      
      const res = await fetch(hasuraUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(hasuraSecret && { "x-hasura-admin-secret": hasuraSecret }),
        },
        body: JSON.stringify({
          query,
          variables: { nomeLocale: nameToFetch },
        }),
      });

      const json = await res.json();
      
      if (json.data && json.data.locali && json.data.locali.length > 0) {
        setData(json.data);
        setNomeLocale(nameToFetch);
        // Salva l'ID del ristorante nell'URL quando viene caricato con successo
        saveId(nameToFetch);
      } else {
        // Nessun locale trovato con questo ID
        setError("Ristorante non trovato. Verifica il nome e riprova.");
        setData(null);
      }
    } catch (err) {
      console.error(err);
      setError("Errore durante il caricamento del menu");
    } finally {
      setLoading(false);
    }
  };

  // Effetto per caricare automaticamente il ristorante dall'URL all'avvio
  // Questo permette di condividere l'URL con l'ID del ristorante già presente
  useEffect(() => {
    const restaurantId = readId();
    if (restaurantId) {
      // Se c'è un restaurantId nell'URL, carica direttamente il ristorante
      fetchMenu(restaurantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Esegui solo al mount del componente

  const calculateTotal = () => {
    if (!data) return 0;
    let total = 0;
    data.locali.forEach((locale) =>
      locale.menu.forEach((menu) =>
        menu.menu_sezioni.forEach((sezione) =>
          sezione.menu_items.forEach((item) => {
            const quantity = quantities[item.uuid] || 0;
            total += item.prezzo * quantity;
          })
        )
      )
    );
    return total;
  };

  const getCategories = () => {
    if (!data) return [];
    const categories = new Set<string>();
    if (selectedCategory) {
      const hasItems = data.locali.some((locale) =>
        locale.menu.some((menu) =>
          menu.menu_sezioni.some((sezione) =>
            sezione.menu_items.some((item) => item.tipologia === selectedCategory)
          )
        )
      );
      if (hasItems) categories.add(selectedCategory);
      return Array.from(categories);
    }
    data.locali.forEach((locale) =>
      locale.menu.forEach((menu) =>
        menu.menu_sezioni.forEach((sezione) =>
          sezione.menu_items.forEach((item) => categories.add(item.tipologia))
        )
      )
    );
    return Array.from(categories);
  };

  const handleCheckout = () => {
    if (!data || calculateTotal() === 0) return;

    const orderItems: any[] = [];
    data.locali.forEach((locale) =>
      locale.menu.forEach((menu) =>
        menu.menu_sezioni.forEach((sezione) =>
          sezione.menu_items.forEach((item) => {
            const quantity = quantities[item.uuid] || 0;
            if (quantity > 0) {
              orderItems.push({
                uuid: item.uuid,
                nome: item.nome,
                prezzo: item.prezzo,
                quantita: quantity,
              });
            }
          })
        )
      )
    );

    const orderData = {
      items: orderItems,
      total: calculateTotal(),
    };

    // Passa i dati dell'ordine direttamente tramite localStorage o state management
    // Per ora usiamo localStorage come soluzione semplice
    localStorage.setItem('orderData', JSON.stringify(orderData));
    router.push('/checkout');
  };

  return (
    <>
      <Header title="Menù" showBackButton={false} />

      <div className="pb-32" style={{ backgroundColor: 'var(--color-gray-50)', minHeight: '100vh' }}>
        {/* Barra ricerca */}
        <div className="pt-4 pb-2">
          <SearchBar
            value={nomeLocale}
            onChange={setNomeLocale}
            onSearch={fetchMenu}
            placeholder="Inserisci nome locale"
            loading={loading}
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Caricamento...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {data && data.locali.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Nessun locale trovato.</p>
          </div>
        )}

        {/* Categorie */}
        {data && getCategories().length > 0 && (
          <CategoryCarousel
            categories={getCategories()}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Lista piatti */}
        {data &&
          data.locali.map((locale) => (
            <div key={locale.nome_locale} className="px-4">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{locale.nome_locale}</h2>

              {locale.menu.map((menu) => (
                <div key={menu.uuid}>
                  {menu.menu_sezioni.map((sezione) => (
                    <div key={sezione.uuid} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">{sezione.nome}</h3>

                      <div className="flex flex-col gap-3">
                        {sezione.menu_items
                          .filter((item) => !selectedCategory || item.tipologia === selectedCategory)
                          .map((item) => (
                            <ProductCard
                              key={item.uuid}
                              uuid={item.uuid}
                              nome={item.nome}
                              descrizione={item.descrizione}
                              prezzo={item.prezzo}
                              quantity={quantities[item.uuid] || 0}
                              onUpdateQuantity={updateQuantity}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Barra totale fissa */}
      {data && calculateTotal() > 0 && (
        <div 
          className="fixed left-0 right-0 bg-white border-t shadow-lg p-4"
          style={{ 
            bottom: '4rem',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 30
          }}
        >
          <div className="max-w-md mx-auto flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-900">Totale:</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl" style={{ color: 'var(--color-secondary)' }}>
                €{calculateTotal().toFixed(2)}
              </span>
              <button
                onClick={handleCheckout}
                disabled={calculateTotal() === 0}
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  padding: '0.5rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
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

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Caricamento...</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}