"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("America/Argentina/Buenos_Aires");
  const [country, setCountry] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !password) return alert("Completa todos los campos.");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, timezone, country })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario registrado correctamente");
        router.push("/auth/login");
      } else {
        alert(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro de usuario</h1>
      <input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className={styles.inputField}
      />
      <input
        placeholder="País"
        value={country}
        onChange={e => setCountry(e.target.value)}
        className={styles.inputField}
      />
      <select
        value={timezone}
        onChange={e => setTimezone(e.target.value)}
        className={styles.selectField}
      >
        <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
        <option value="America/Mexico_City">México (CDMX)</option>
        <option value="America/Santiago">Chile (Santiago)</option>
        <option value="America/Bogota">Colombia (Bogotá)</option>
      </select>
      <button onClick={handleRegister} className={styles.button}>Registrarse</button>
      <p className={styles.infoText}>
        ¿Ya tienes cuenta? <span className={styles.link} onClick={() => router.push("/auth/login")}>Inicia sesión</span>
      </p>
    </div>
  );
}
