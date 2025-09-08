import Counter from "../../../../../models/Counter";
import dbConnect from "../../../../../lib/mongodb";

// GET → obtener un contador específico
export async function GET(req, context) {
  try {
    await dbConnect();

    // Esperar params antes de usar
    const { id } = await context.params;

    const counter = await Counter.findById(id).lean();

    if (!counter) {
      return new Response(JSON.stringify({ error: "No encontrado" }), { status: 404 });
    }

    if (counter.endTime) {
      counter.endTime = new Date(counter.endTime).getTime();
    }

    return new Response(JSON.stringify(counter), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener el contador" }), { status: 500 });
  }
}


// DELETE → eliminar un contador específico
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const result = await Counter.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Contador no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Contador eliminado" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al eliminar el contador" }), { status: 500 });
  }
}
