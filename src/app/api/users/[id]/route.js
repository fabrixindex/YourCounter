import User from "../../../../../models/User";
import Counter from "../../../../../models/Counter"; //dejarlo aunque no se use (population)
import dbConnect from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";

// Obtener usuario por ID 
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const user = await User.findById(id)
      .select("-passwordHash")
      .populate({
        path: "counters",
        select: "name endTime timezone",
      })
      .lean(); 

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(user, null, 2), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener usuario" }), { status: 500 });
  }
}


// Actualizar usuario por ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; 
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

    return new Response(
      JSON.stringify(
        {
          message: "User updated successfully",
          data: {
            id: updatedUser._id,
            name: updatedUser.name,
            timezone: updatedUser.timezone,
            country: updatedUser.country,
            counters: updatedUser.counters,
            updatedAt: updatedUser.updatedAt
          }
        },
        null,
        2 
      ),
      { status: 200 }
    );
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al actualizar usuario" }), { status: 500 });
  }
}

// Borrar usuario por ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; 
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(
      JSON.stringify(
        {
          message: "User deleted successfully",
          timestamp: new Date().toISOString()
        },
        null,
        2
      ),
      { status: 200 }
    );
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al eliminar usuario" }), { status: 500 });
  }
}
