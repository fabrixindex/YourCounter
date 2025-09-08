"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DateTime } from "luxon";
import styles from "./page.module.css";

export default function CounterPage() {
  const { id } = useParams();
  const [counter, setCounter] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;

    async function fetchCounter() {
      try {
        const res = await fetch(`/api/counters/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Contador no encontrado");
          return;
        }

        setCounter(data);

        if (data.endTime) {
          interval = setInterval(() => {
            const now = DateTime.now().toMillis();
            const endTime = DateTime.fromMillis(data.endTime, { zone: data.timezone || "UTC" }).toMillis();
            const remaining = Math.max(0, endTime - now);
            setTimeLeft(remaining);

            if (remaining <= 0) clearInterval(interval);
          }, 1000);
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
      }
    }

    fetchCounter();

    return () => clearInterval(interval);
  }, [id]);

  const formatTime = ms => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (error) return <p className={styles.loading}>{error}</p>;
  if (!counter) return <p className={styles.loading}>Cargando...</p>;

  return (
    <div className={styles.container}>
      <p className={styles.smallTitle}>✨ Cuenta regresiva ✨</p>
      <h1 className={styles.counterName}>{counter.name || "Contador"}</h1>
      <h2 className={styles.time}>{formatTime(timeLeft)}</h2>
      {counter.endTime && (
        <p className={styles.timezone}>
          Hora de finalización{" "}
          {counter.timezone ? `(${counter.timezone})` : "(hora local)"}:{" "}
          {DateTime.fromMillis(counter.endTime, { zone: counter.timezone || DateTime.local().zoneName })
            .toLocaleString(DateTime.DATETIME_FULL)}
        </p>
      )}
    </div>
  );
}
