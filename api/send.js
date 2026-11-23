import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Permitir solicitudes desde tu frontend
    res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.FRONTEND_URL
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { name, phone, email, message } = req.body;

        if (!name?.trim() || !message?.trim() || (!phone?.trim() && !email?.trim())) {
            return res.status(400).json({
                error: "Completa los campos obligatorios."
            });
        }

        const { error } = await resend.emails.send({
            from: "Contacto <onboarding@resend.dev>",
            to: process.env.CONTACT_TO_EMAIL,
            subject: `Nuevo contacto de ${name}`,
            text: `
Nombre: ${name}
Teléfono: ${phone || "No proporcionado"}
Correo: ${email || "No proporcionado"}

Mensaje:
${message}
      `
        });

        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "No se pudo enviar el mensaje."
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Error interno del servidor."
        });
    }
}