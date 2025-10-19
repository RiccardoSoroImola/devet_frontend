"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * Hook per gestire il restaurantId nella query string dell'URL.
 * 
 * Questo permette di condividere l'URL con l'ID del ristorante già presente,
 * consentendo agli utenti di accedere direttamente al ristorante senza dover
 * passare attraverso la schermata di ricerca.
 * 
 * Supporta sia 'restaurantId' che la chiave abbreviata 'r' come query parameter.
 */
export function useRestaurantUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Legge l'ID del ristorante dalla query string.
   * Supporta sia 'restaurantId' che 'r' come chiavi.
   * 
   * @returns L'ID del ristorante se presente, altrimenti null
   */
  const readId = (): string | null => {
    return searchParams.get("restaurantId") || searchParams.get("r");
  };

  /**
   * Salva l'ID del ristorante nella query string.
   * Preserva tutti gli altri query parameters esistenti.
   * 
   * @param id - L'ID del ristorante da salvare
   * @param replace - Se true, usa router.replace invece di router.push (default: true)
   */
  const saveId = (id: string, replace: boolean = true): void => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Rimuovi la chiave abbreviata se presente
    params.delete("r");
    
    // Imposta il restaurantId con il nuovo valore
    params.set("restaurantId", encodeURIComponent(id));

    const newUrl = `${pathname}?${params.toString()}`;
    
    if (replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  /**
   * Rimuove l'ID del ristorante dalla query string.
   * Preserva tutti gli altri query parameters.
   * Utile per "cambia ristorante" o reset della UI.
   * 
   * @param replace - Se true, usa router.replace invece di router.push (default: true)
   */
  const removeId = (replace: boolean = true): void => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Rimuovi entrambe le chiavi
    params.delete("restaurantId");
    params.delete("r");

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    
    if (replace) {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  return {
    readId,
    saveId,
    removeId,
  };
}
