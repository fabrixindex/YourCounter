import Counter from "../../../../models/Counter";
import dbConnect from "../../../../lib/mongodb";
import { authenticate } from "../../../../lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req); 
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const counters = await Counter.find({ creatorId: user._id })
      .populate("creatorId", "name timezone country") 
      .lean();

    return new Response(
      JSON.stringify(
        {
          message: "Counters retrieved successfully",
          data: counters,
        },
        null,
        2
      ),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error al obtener contadores:", err);
    return new Response(JSON.stringify({ error: "Error al obtener contadores" }), { status: 500 });
  }
}

// POST → crear un contador nuevo
export async function POST(req) {
  try {
    await dbConnect();

    // Verificar token
    const user = await authenticate(req); 
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
    
    const { name, endTime, timezone } = await req.json();

    if (!name || !endTime || !timezone) {
      return new Response(JSON.stringify({ error: "Faltan campos" }), { status: 400 });
    }

    const newCounter = new Counter({
      creatorId: user._id, 
      name,
      endTime,
      timezone,
    });

    await newCounter.save();

    user.counters.push(newCounter._id);
    await user.save();

    return new Response(
      JSON.stringify(
        {
          message: "Counter created successfully",
          counter: {
            id: newCounter._id,
            name: newCounter.name,
            endTime: newCounter.endTime,
            timezone: newCounter.timezone,
            creatorId: newCounter.creatorId,
          },
        },
        null,
        2 
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear contador:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
