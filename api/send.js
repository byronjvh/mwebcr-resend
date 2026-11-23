import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { nombre, contacto, mensaje } = await request.json();

        if (!nombre || !contacto || !mensaje) {
            return Response.json(
                { error: "Completa todos los campos" },
                { status: 400 }
            );
        }

        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: process.env.CONTACT_TO_EMAIL,
            subject: `Nuevo mensaje de ${nombre}`,
            text: `
Nombre: ${nombre}
Contacto: ${contacto}

Mensaje:
${mensaje}
      `,
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json({ success: true });

    } catch (error) {
        return Response.json(
            { error: "Error al enviar el mensaje" },
            { status: 500 }
        );
    }
}