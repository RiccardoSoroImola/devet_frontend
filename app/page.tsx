```tsx
"use client";

import { useState } from "react";

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
  const [nomeLocale, setNomeLocale] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stato quantità piatti
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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

  return (
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
                      {sezione.menu_items.map((item) => (
                        <div
                          key={item.uuid}
                          className="flex items-center gap-3 border rounded-lg shadow p-2"
                        >
                          {/* Immagine placeholder */}
                          <img
                            src="https://via.placeholder.com/80"
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
  );
}
```
