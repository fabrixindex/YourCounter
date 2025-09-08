import User from "../../../../models/User";
import dbConnect from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

// Obtener usuario por ID
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // 🔹 await necesario
    const user = await User.findById(id).select("-passwordHash"); // no devolver hash
    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener usuario" }), { status: 500 });
  }
}

// Actualizar usuario por ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // 🔹 await necesario
    const data = await req.json();
    const { name, password, timezone, country } = data;

    const updateData = {};
    if (name) updateData.name = name;
    if (timezone) updateData.timezone = timezone;
    if (country) updateData.country = country;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-passwordHash");
    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al actualizar usuario" }), { status: 500 });
  }
}

// Borrar usuario por ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // 🔹 await necesario
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Usuario eliminado correctamente" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al eliminar usuario" }), { status: 500 });
  }
}
