"use client";
import { useState } from "react";
import Image from "next/image";

type MenuItem = {
  uuid: string;
  nome: string;
  tipologia: string;
  descrizione: string;
  prezzo: number;
  immagine?: string;
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
        body: JSON.stringify({ query, variables: { nomeLocale } }),
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

  // --- UI ---
  return (
  <main className="min-h-screen bg-gray-50 pb-24 font-[Inter]">
    {/* HEADER */}
    <header className="sticky top-0 bg-white shadow-sm p-4 z-20 flex justify-between items-center">
      <button
        onClick={() => setData(null)}
        className="text-gray-600 text-lg font-medium"
      >
        ←
      </button>
      <h1 className="text-lg font-semibold">Menù</h1>
      <div className="w-5" />
    </header>

    {/* SEARCH BAR */}
<div className="px-4 mt-4">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      fetchMenu();
    }}
    className="flex gap-2"
  >
    <input
      type="text"
      placeholder="Inserisci nome locale"
      value={nomeLocale}
      onChange={(e) => setNomeLocale(e.target.value)}
      className="w-full rounded-2xl border border-gray-200 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
    />
  </form>
</div>


    {/* CATEGORY CAROUSEL */}
    {data && data.locali[0]?.menu[0]?.menu_sezioni && (
      <div className="flex overflow-x-auto gap-5 px-4 py-5 no-scrollbar">
        {data.locali[0].menu[0].menu_sezioni.map((sezione) => (
          <button
            key={sezione.uuid}
            className="flex flex-col items-center justify-center shrink-0"
          >
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-1">
              🍽️
            </div>
            <span className="text-xs font-medium text-gray-700">
              {sezione.nome}
            </span>
          </button>
        ))}
      </div>
    )}

    {/* MENU SECTIONS */}
    {data &&
      data.locali.map((locale) => (
        <div key={locale.nome_locale}>
          {locale.menu[0]?.menu_sezioni.map((sezione) => (
            <section key={sezione.uuid} className="px-4 mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {sezione.nome}
                </h2>
                <button className="text-sm text-green-600 font-medium">
                  Filtri
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {sezione.menu_items.map((item) => (
                  <div
                    key={item.uuid}
                    className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition"
                  >
                    {/* IMG */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.immagine ||
                          "https://placehold.co/100x100?text=IMG"
                        }
                        alt={item.nome}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* TEXT + PRICE + BUTTONS */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {item.nome}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.descrizione}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-semibold text-gray-900">
                          € {item.prezzo.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.uuid, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full font-bold"
                          >
                            −
                          </button>
                          <span className="text-sm w-4 text-center text-gray-800">
                            {quantities[item.uuid] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.uuid, +1)}
                            className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ))}
  </main>
);
}
