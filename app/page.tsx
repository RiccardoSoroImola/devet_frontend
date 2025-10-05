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
      const res = await fetch("https://YOUR-HASURA-ENDPOINT/v1/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "YOUR-HASURA-ADMIN-SECRET",
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Menu Locale</h1>
      
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
          <div key={locale.nome_locale} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{locale.nome_locale}</h2>
            {locale.menu.map((menu) => (
              <div key={menu.uuid} className="border rounded p-4 mb-4 shadow">
                {menu.menu_sezioni.map((sezione) => (
                  <div key={sezione.uuid} className="mb-3">
                    <h3 className="text-xl font-medium mb-1">{sezione.nome}</h3>
                    <ul className="ml-4">
                      {sezione.menu_items.map((item) => (
                        <li key={item.uuid} className="mb-1">
                          <strong>{item.nome}</strong> ({item.tipologia}) - €{item.prezzo.toFixed(2)}
                          <p className="text-gray-700">{item.descrizione}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
