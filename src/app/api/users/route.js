import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";

// GET → Listar todos los usuarios
export async function GET() {
  try {
    await dbConnect();

    // Obtener todos los usuarios y excluir passwordHash
    const users = await User.find().select("-passwordHash").lean();

    return new Response(
      JSON.stringify(
        {
          message: "Users retrieved successfully",
          data: users.map(user => ({
            id: user._id,
            name: user.name,
            timezone: user.timezone,
            country: user.country,
            counters: user.counters 
          })),
        },
        null,
        2 
      ),
      { status: 200 }
    );
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener usuarios" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const { name, password, timezone, country } = data;

    if (!name || !password) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "La contraseña debe tener al menos 6 caracteres" }), { status: 400 });
    }

    const existingUser = await User.findOne({ name: name.toLowerCase() });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "El usuario ya existe" }), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.toLowerCase(),
      passwordHash,
      timezone: timezone || "America/Argentina/Buenos_Aires",
      country: country || "",
      counters: [],
    });

    await user.save();

    return new Response(
      JSON.stringify(
        {
          message: "User created successfully",
          data: {
            id: user._id,
            name: user.name,
            timezone: user.timezone,
            country: user.country,
            createdAt: user.createdAt
          }
        },
        null,
        2 
      ),
      { status: 201 }
    );

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al crear el usuario" }), { status: 500 });
  }
}
