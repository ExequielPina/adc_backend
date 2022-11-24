import nodemailer from 'nodemailer';



const newPass = async ( datos ) => {
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
        subject: "Crea una nueva contraseña en ADC - Administrador de citas",
        text: "Crea una nueva contraseña - Administrador de citas",
        html: `<p>Hola: ${nombre}, has solicitado restablecer tu contraseña en ADC.</p>
              <p>Solo tienes que pinchar en el siguiente enlace y crear una nueva contraseña:
              <a href="${process.env.FRONTEND_URL}/restablecer/${token}">Pincha aquí para restablecer tu contraseña.</a> </p>
              <p>Si tú no has creado esta cuenta, puedes ignorar este mensaje.</p>

        `, 
      });

      console.log("mensaje enviado: %s", info.messageId);
};



export default newPass;