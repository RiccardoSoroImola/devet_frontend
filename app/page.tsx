
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export default function MenuPage() {
  const [nomeLocale, setNomeLocale] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // stato carrello: { [itemId]: { item, qty } }
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number }>>({});

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

  const addToCart = (item: MenuItem, qty: number) => {
    if (qty <= 0) return;
    setCart((prev) => ({
      ...prev,
      [item.uuid]: { item, qty: (prev[item.uuid]?.qty || 0) + qty },
    }));
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const items = Object.values(cart).map(({ item, qty }) => ({
      id: item.uuid,
      name: item.nome,
      price: item.prezzo,
      quantity: qty,
    }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const session = await res.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  const total = Object.values(cart).reduce(
    (acc, { item, qty }) => acc + item.prezzo * qty,
    0
  );

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
                        <li key={item.uuid} className="mb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <strong>{item.nome}</strong> ({item.tipologia}) - €
                              {item.prezzo.toFixed(2)}
                              <p className="text-gray-700">{item.descrizione}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                defaultValue={1}
                                id={`qty-${item.uuid}`}
                                className="w-16 border rounded p-1"
                              />
                              <button
                                onClick={() =>
                                  addToCart(
                                    item,
                                    Number(
                                      (
                                        document.getElementById(
                                          `qty-${item.uuid}`
                                        ) as HTMLInputElement
                                      )?.value || 1
                                    )
                                  )
                                }
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Aggiungi
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

      {Object.keys(cart).length > 0 && (
        <div className="border-t pt-4 mt-6">
          <h2 className="text-2xl font-bold mb-3">Carrello</h2>
          <ul>
            {Object.values(cart).map(({ item, qty }) => (
              <li key={item.uuid}>
                {item.nome} x {qty} = €{(item.prezzo * qty).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-semibold">Totale: €{total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Procedi al pagamento
          </button>
        </div>
      )}
    </div>
  );
}
