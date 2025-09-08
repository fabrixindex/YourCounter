import Counter from "../../../../models/Counter";
import dbConnect from "../../../../lib/mongodb";

// GET → obtener todos los contadores
export async function GET() {
  try {
    await dbConnect();

    const counters = await Counter.find().lean();

    return new Response(JSON.stringify(counters), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al obtener contadores" }), { status: 500 });
  }
}

// POST → crear un contador nuevo
export async function POST(req) {
  try {
    await dbConnect();

    const { name, endTime, timezone } = await req.json();

    const newCounter = new Counter({
      name,
      endTime,
      timezone,
    });

    await newCounter.save();

    return new Response(JSON.stringify({ id: newCounter._id }), { status: 201 });
  } catch (error) {
    console.error("Error al crear contador:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
