import User from "../../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, password } = await req.json();

  const user = await User.findOne({ name });
  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: "Login exitoso", id: user._id }), { status: 200 });
}
