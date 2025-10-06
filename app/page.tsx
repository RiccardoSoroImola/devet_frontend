
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
};

type Data = {
  locali: Locale[];
};

export default function MenuPage() {
  const router = useRouter();
  const [nomeLocale, setNomeLocale] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stato quantità piatti
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const updateQuantity = (uuid: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[uuid] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [uuid]: newVal };
    });
  };

  const fetchMenu = async () => {
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
      const res = await fetch("https://safe-macaque-83.hasura.app/v1/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "kr5qRiKc007l1UTGTDthkvoLUinNhnIsNjwj005lIkVECnBjsf2911jX9FK50NHs",
        },
        body: JSON.stringify({
          query,
          variables: { nomeLocale },
        }),
      });

      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error(err);
      setError("Errore durante il fetch");
    } finally {
      setLoading(false);
    }
  };

  // Funzione per calcolare il totale dell'ordine
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

  // Ricava le categorie da tutti gli item, considerando solo quelle con elementi visibili
  const getCategories = () => {
    if (!data) return [];
    const categories = new Set<string>();
    
    // Se c'è una categoria selezionata, mostra solo quella categoria se contiene elementi
    if (selectedCategory) {
      // Verifica se ci sono elementi con questa categoria
      const hasItems = data.locali.some((locale) =>
        locale.menu.some((menu) =>
          menu.menu_sezioni.some((sezione) =>
            sezione.menu_items.some((item) => item.tipologia === selectedCategory)
          )
        )
      );
      
      if (hasItems) {
        categories.add(selectedCategory);
      }
      return Array.from(categories);
    }
    
    // Se non c'è una categoria selezionata, mostra tutte le categorie
    data.locali.forEach((locale) =>
      locale.menu.forEach((menu) =>
        menu.menu_sezioni.forEach((sezione) =>
          sezione.menu_items.forEach((item) => categories.add(item.tipologia))
        )
      )
    );
    return Array.from(categories);
  };

  // Funzione per gestire il checkout e passare alla pagina di riepilogo
  const handleCheckout = () => {
    if (!data || calculateTotal() === 0) return;
    
    // Raccogli gli elementi ordinati
    const orderItems = [];
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
                quantita: quantity
              });
            }
          })
        )
      )
    );
    
    // Prepara i dati da passare alla pagina di checkout
    const orderData = {
      items: orderItems,
      total: calculateTotal()
    };
    
    // Naviga alla pagina di checkout con i dati dell'ordine
    router.push(`/checkout?orderData=${encodeURIComponent(JSON.stringify(orderData))}`);
  };

  return (
    <>
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Menù</h1>

      {/* Barra ricerca */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Inserisci nome locale"
          value={nomeLocale}
          onChange={(e) => setNomeLocale(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={fetchMenu}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cerca
        </button>
      </div>

      {loading && <p>Caricamento...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && data.locali.length === 0 && <p>Nessun locale trovato.</p>}

      {/* Categorie */}
      {data && (
        <div className="flex gap-3 overflow-x-auto mb-4">
          {getCategories().map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`flex flex-col items-center px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700"
              }`}
            >
              <span className="text-sm">{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Lista piatti */}
      {data &&
        data.locali.map((locale) => (
          <div key={locale.nome_locale}>
            <h2 className="text-xl font-semibold mb-3">{locale.nome_locale}</h2>

            {locale.menu.map((menu) => (
              <div key={menu.uuid}>
                {menu.menu_sezioni.map((sezione) => (
                  <div key={sezione.uuid} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">{sezione.nome}</h3>

                    <div className="flex flex-col gap-4">
                      {sezione.menu_items
                        .filter(
                          (item) =>
                            !selectedCategory || item.tipologia === selectedCategory
                        )
                        .map((item) => (
                          <div
                            key={item.uuid}
                            className="flex items-center gap-3 border rounded-lg shadow p-2"
                          >
                            {/* Immagine fissa */}
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Meet_Truffle%21.jpg/800px-Meet_Truffle%21.jpg"
                              alt={item.nome}
                              className="w-20 h-20 object-cover rounded-md"
                            />

                            {/* Info piatto */}
                            <div className="flex-1">
                              <p className="font-semibold">{item.nome}</p>
                              <p className="text-sm text-gray-600">
                                {item.descrizione}
                              </p>
                              <p className="font-medium mt-1">
                                €{item.prezzo.toFixed(2)}
                              </p>
                            </div>

                            {/* Contatore */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.uuid, -1)}
                                className="w-8 h-8 flex items-center justify-center border rounded-full"
                              >
                                -
                              </button>
                              <span>{quantities[item.uuid] || 0}</span>
                              <button
                                onClick={() => updateQuantity(item.uuid, 1)}
                                className="w-8 h-8 flex items-center justify-center border rounded-full bg-green-500 text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
    </div>
    
    {/* Barra del totale fissa in fondo */}
    {data && (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <span className="font-semibold text-lg">Totale ordine:</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-green-600">€{calculateTotal().toFixed(2)}</span>
            <button
              onClick={handleCheckout}
              disabled={calculateTotal() === 0}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg ${calculateTotal() === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
            >
              Ordina
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

