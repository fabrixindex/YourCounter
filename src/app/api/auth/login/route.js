import User from "../../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../../lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, password } = await req.json();

    if (!name || !password) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    const user = await User.findOne({ name: name.toLowerCase() });
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 401 });
    }

    // Crear JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        token,
        user: { id: user._id, name: user.name, timezone: user.timezone, country: user.country }
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al iniciar sesión" }), { status: 500 });
  }
}
