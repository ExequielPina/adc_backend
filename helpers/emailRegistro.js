import nodemailer from 'nodemailer';


const emailRegistro = async ( datos ) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const { email, nombre, token } = datos;

      // Enviar email

      const info = await transporter.sendMail({
        from: "AC - Administrador de citas",
        to: email,
        subject: "Confirma tu cuenta en ADC - Administrador de citas",
        text: "Confirma tu cuenta en ADC - Administrador de citas",
        html: `<p>Hola: ${nombre}, confirma tu cuenta en ADC.</p>
              <p>Solo tienes que pinchar en el siguiente enlace:
              <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Pincha aquí para confirmar tu cuenta</a> </p>
              <p>Si tú no has creado esta cuenta, puedes ignorar este mensaje.</p>

        `, 
      });

      console.log("mensaje enviado: %s", info.messageId);
};



export default emailRegistro;