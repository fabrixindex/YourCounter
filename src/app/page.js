"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import TimePicker from "react-time-picker";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import 'react-time-picker/dist/TimePicker.css'; 
import 'react-clock/dist/Clock.css';
import 'react-day-picker/dist/style.css';

export default function CounterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [timezone, setTimezone] = useState("America/Argentina/Buenos_Aires");
  const [counterLink, setCounterLink] = useState("");

  const timezones = [
    { label: "🇦🇷 Argentina (Buenos Aires)", value: "America/Argentina/Buenos_Aires" },
    { label: "🇲🇽 México (Ciudad de México)", value: "America/Mexico_City" },
    { label: "🇨🇱 Chile (Santiago)", value: "America/Santiago" },
    { label: "🇨🇴 Colombia (Bogotá)", value: "America/Bogota" },
    { label: "🇵🇪 Perú (Lima)", value: "America/Lima" },
    { label: "🇺🇾 Uruguay (Montevideo)", value: "America/Montevideo" },
    { label: "🇵🇾 Paraguay (Asunción)", value: "America/Asuncion" },
    { label: "🇻🇪 Venezuela (Caracas)", value: "America/Caracas" },
    { label: "🇪🇨 Ecuador (Quito)", value: "America/Guayaquil" },
    { label: "🇬🇹 Guatemala (Ciudad de Guatemala)", value: "America/Guatemala" },
    { label: "🇭🇳 Honduras (Tegucigalpa)", value: "America/Tegucigalpa" },
    { label: "🇳🇮 Nicaragua (Managua)", value: "America/Managua" },
    { label: "🇸🇻 El Salvador (San Salvador)", value: "America/El_Salvador" },
    { label: "🇧🇷 Brasil (São Paulo)", value: "America/Sao_Paulo" },
    { label: "🇨🇦 Canadá (Toronto)", value: "America/Toronto" },
    { label: "🇺🇸 EE.UU. (Nueva York)", value: "America/New_York" },
    { label: "🇨🇷 Costa Rica (San José)", value: "America/Costa_Rica" },
    { label: "🇨🇺 Cuba (La Habana)", value: "America/Havana" },
    { label: "🇩🇴 República Dominicana (Santo Domingo)", value: "America/Santo_Domingo" },
    { label: "🇵🇦 Panamá (Ciudad de Panamá)", value: "America/Panama" },
    { label: "🇧🇴 Bolivia (La Paz)", value: "America/La_Paz" },
    { label: "🇧🇿 Belice (Belmopán)", value: "America/Belize" },
    { label: "🇪🇸 España (Madrid)", value: "Europe/Madrid" },
    { label: "🇬🇧 Reino Unido (Londres)", value: "Europe/London" },
  ];

  const createCounter = async () => {
    if (!name || !selectedDay || !time) {
      return alert("Completa todos los campos.");
    }
  
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = DateTime.fromJSDate(selectedDay)
      .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 })
      .setZone(timezone);
  
    try {
      const response = await fetch(`/api/counters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          endTime: dateTime.toISO(),
          timezone
        })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const link = `${window.location.origin}/c/${result.id}`;
        setCounterLink(link);
        alert("Contador creado exitosamente!");
      } else {
        alert(result.error || "Error al crear el contador");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };
  

  const copyLink = () => {
    navigator.clipboard.writeText(counterLink);
    alert("Link copiado al portapapeles!");
  };

  return (
    <div className="styleForm">

      {/* Botones de redirección */}
      <button onClick={() => router.push("/auth/login")}>
        Ir a Login
      </button>
      <button onClick={() => router.push("/auth/register")}>
        Ir a Registro
      </button>

      <h2 className="styleMainTitle">Crear Contador</h2>

      <div className="styleField">
        <label className="styleLabel">Nombre del evento</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="styleInput"
          required
        />
      </div>

      <div className="styleField">
        <label className="styleLabel">Fecha</label>
          <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          disabled={{ before: new Date() }}
        />
        <p>Fecha seleccionada: {selectedDay?.toLocaleDateString()}</p>
      </div>

      <div className="styleField">
        <label className="styleLabel">Hora (24h)</label>
        <TimePicker
          onChange={setTime}
          value={time}
          format="HH:mm"
          disableClock={false}
          clearIcon={null}
          clockIcon={<span>🕒</span>}
        />
      </div>

      <div className="styleField">
        <label className="styleLabel">Zona horaria</label>
        <select
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          className="styleInput"
        >
          {timezones.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={createCounter}
        style={{
          marginTop: "20px", fontSize: "1.5rem", padding: "10px 30px",
          borderRadius: "10px", border: "none", cursor: "pointer",
          backgroundColor: "#4f46e5", color: "#fff", fontWeight: "bold",
          transition: "0.3s"
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#3730a3"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "#4f46e5"}
      >
        Crear contador
      </button>

      {counterLink && (
        <div style={{
          marginTop: "20px", padding: "15px 20px", background: "#fff",
          borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <p style={{ margin: "0 0 10px", fontSize: "1.2rem", color: "#333" }}>
            Enlace a tu contador:
          </p>
          <a
            href={counterLink}
            style={{
              color: "#2563eb", fontSize: "1.2rem",
              textDecoration: "underline", wordBreak: "break-all"
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {counterLink}
          </a>
          <br />
          <button
            onClick={copyLink}
            style={{
              marginTop: "10px", fontSize: "1rem", padding: "5px 15px",
              borderRadius: "8px", border: "none", cursor: "pointer",
              backgroundColor: "#10b981", color: "#fff", fontWeight: "bold"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#059669"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#10b981"}
          >
            Copiar link
          </button>

        </div>
      )}
    </div>
  );
}
