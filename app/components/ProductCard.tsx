"use client";

import Image from "next/image";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  uuid: string;
  nome: string;
  descrizione: string;
  prezzo: number;
  quantity: number;
  onUpdateQuantity: (uuid: string, delta: number) => void;
  imageUrl?: string;
};

export default function ProductCard({
  uuid,
  nome,
  descrizione,
  prezzo,
  quantity,
  onUpdateQuantity,
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Meet_Truffle%21.jpg/800px-Meet_Truffle%21.jpg",
}: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      <Image
        src={imageUrl}
        alt={nome}
        width={80}
        height={80}
        className={styles.productImage}
      />

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{nome}</h3>
        <p className={styles.productDescription}>{descrizione}</p>
        <p className={styles.productPrice}>€{prezzo.toFixed(2)}</p>
      </div>

      <div className={styles.productActions}>
        <button
          onClick={() => onUpdateQuantity(uuid, -1)}
          className={styles.quantityButton}
          disabled={quantity === 0}
          aria-label="Rimuovi"
        >
          −
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(uuid, 1)}
          className={`${styles.quantityButton} ${styles.increment}`}
          aria-label="Aggiungi"
        >
          +
        </button>
      </div>
    </div>
  );
}
