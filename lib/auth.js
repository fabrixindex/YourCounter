import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta";

export async function authenticate(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Falta el encabezado Authorization");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token no proporcionado");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error("Usuario no encontrado");

    return user; 
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}
