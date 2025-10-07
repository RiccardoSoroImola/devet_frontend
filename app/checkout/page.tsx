"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  uuid: string;
  nome: string;
  prezzo: number;
  quantita: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    // Recupera i dati dell'ordine da localStorage
    const orderDataString = localStorage.getItem('orderData');
    if (orderDataString) {
      try {
        const parsedData = JSON.parse(orderDataString);
        setOrderItems(parsedData.items);
        setTotalAmount(parsedData.total);
        // Pulisci i dati dopo averli caricati
        localStorage.removeItem('orderData');
      } catch (error) {
        console.error("Errore nel parsing dei dati dell'ordine:", error);
      }
    }
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus("processing");

    // Simulazione di un'integrazione con Stripe
    // In un'implementazione reale, qui si chiamerebbe l'API di Stripe
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStatus("success");
    }, 2000);

    // Esempio di come sarebbe l'integrazione reale con Stripe
    /*
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          amount: totalAmount,
        }),
      });

      const session = await response.json();
      
      // Redirect a Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Errore durante il checkout:', error);
      setPaymentStatus('error');
      setIsLoading(false);
    }
    */
  };

  const handleBackToMenu = () => {
    router.push("/");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Riepilogo Ordine</h1>

      {orderItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">Nessun prodotto nel carrello</p>
          <button
            onClick={handleBackToMenu}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Torna al menù
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Prodotti ordinati</h2>
            <div className="border rounded-lg overflow-hidden">
              {orderItems.map((item) => (
                <div
                  key={item.uuid}
                  className="flex justify-between items-center p-3 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-gray-600">
                      Quantità: {item.quantita}
                    </p>
                  </div>
                  <p className="font-semibold">
                    €{(item.prezzo * item.quantita).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Totale</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {paymentStatus === "success" ? (
              <div className="text-center py-4">
                <div className="mb-4 text-green-600 font-semibold">
                  Pagamento completato con successo!
                </div>
                <button
                  onClick={handleBackToMenu}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Torna al menù
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={`bg-green-500 text-white px-4 py-3 rounded-lg font-semibold ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"}`}
                >
                  {isLoading ? "Elaborazione in corso..." : "Paga con Stripe"}
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="border border-gray-300 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Torna al menù
                </button>
              </>
            )}

            {paymentStatus === "error" && (
              <div className="text-red-500 text-center mt-2">
                Si è verificato un errore durante il pagamento. Riprova.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}