export const COMPANY_REGISTER_INVITATION = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invitación Bolsa de Trabajo</title>
  <style>
    /* Algunos clientes de correo soportan estilos en head; la mayoría de estilos clave están inline */
    body { margin:0; padding:0; background-color:#f2f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .email-wrapper { width:100%; background-color:#f2f4f6; padding:20px 0; }
    .email-content { max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.06); }
    .header { background: #622120; display: flex; align-items: center; justify-content: space-between; color:#fff; padding:18px 24px; text-align:left; }
    .header div { background: #FFF; padding: 4px }
    .header img { width: 130px }
    .header h1 { margin:0; font-size:20px; }
    .preheader { display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
    .body { padding:24px; color:#333333; line-height:1.5; font-size:15px; }
    .btn { display:inline-block; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; }
    .footer { background:#fafafa; padding:16px 24px; font-size:13px; color:#7a7a7a; text-align:center; }
    .info-list { margin:12px 0 18px 0; padding-left:18px; }
    @media (max-width:420px) {
      .header h1 { font-size:18px; }
      .body { padding:16px; font-size:14px; }
    }
  </style>
</head>
<body>
  <!-- Preheader text (visible in inbox preview) -->
  <div class="preheader">Invitamos a su empresa a registrarse en la Bolsa de Trabajo de {{UNIVERSIDAD}} — publicación gratuita de ofertas y prácticas.</div>

  <div class="email-wrapper">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="600" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header -->
            <tr>
              <td class="header" align="left">
                <h1>Bolsa de Trabajo</h1>
                <div>
                  <img class="img" src="https://upqroo.edu.mx/wp-content/uploads/2025/03/UPQROO-logo.png" />
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="body">
                <p>Estimado(a) <strong>{{Nombre del representante / Empresa}}</strong>,</p>

                <p>La <strong>Universidad Politécnica de Quintana Roo</strong> le invita cordialmente a registrar su empresa en nuestra <strong>Bolsa de Trabajo Universitaria</strong>, una plataforma gratuita pensada para conectar a empresas con nuestros estudiantes y egresados.</p>

                <p>Al registrarse podrá:</p>
                <ul class="info-list">
                  <li>📢 Publicar ofertas de empleo y prácticas profesionales sin costo.</li>
                  <li>🎓 Acceder a perfiles de estudiantes y egresados altamente capacitados.</li>
                  <li>🤝 Fortalecer la vinculación con la universidad y participar en el desarrollo del talento local.</li>
                </ul>

                <p style="text-align:center; margin:20px 0;">
                  <!-- Button: Reemplazar href por la URL real -->
                  <a href="http://redtalento.upqroo.edu.mx/signup" target="_blank" class="btn" style="background-color:#622120; color:#ffffff; border:1px solid #0b74de;">
                    Registrarse gratuitamente
                  </a>
                </p>

                <p>Si requiere ayuda para completar el registro o desea publicar su primera oferta, responda este correo o contacte a nuestro equipo:</p>

                <p style="margin:6px 0;"><strong>Contacto:</strong><br>
                  Vinculación y Gestión Empresarial • gestionempresarial@upqroo.edu.mx • Tel. 998 259 6180</p>

                <p>Agradecemos su interés y esperamos contar con su valiosa participación para generar oportunidades reales a nuestros estudiantes.</p>

                <p>Atentamente,<br>
                <strong>Universidad Politécnica de Quintana Roo — Área de Vinculación y Gestión Empresarial</strong></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="footer">
                <div style="font-size:12px;color:#9aa0a6;">
                  Universidad Politécnica de Quintana Roo — Av. Arco Bincentenario, Mza. 11, Lote 1119-33 Sm 255, 77500 • Cancún, Quintana Roo • 2025.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`