"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!name || !password) return alert("Completa todos los campos.");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login exitoso");
        router.push("/contador");
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar sesión</h1>
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
      <button onClick={handleLogin} className={styles.button}>Iniciar sesión</button>
      <p className={styles.infoText}>
        ¿No tienes cuenta? <span className={styles.link} onClick={() => router.push("/auth/register")}>Regístrate aquí</span>
      </p>
    </div>
  );
}
