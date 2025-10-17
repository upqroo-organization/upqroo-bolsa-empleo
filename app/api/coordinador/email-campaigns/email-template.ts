export const COMPANY_REGISTER_INVITATION = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invitación Bolsa de Trabajo</title>
  <style>
    /* Keep only safe global resets */
    body { margin:0; padding:0; background-color:#f2f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .preheader { display:none !important; visibility:hidden; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
    @media (max-width:420px) {
      .header-title { font-size:18px !important; }
      .body-content { padding:16px !important; font-size:14px !important; }
    }
  </style>
</head>
<body>
  <!-- Preheader text (visible in inbox preview, hidden in email body) -->
  <div class="preheader">Invitamos a su empresa a registrarse en la Bolsa de Trabajo de {{UNIVERSIDAD}} — publicación gratuita de ofertas y prácticas.</div>

  <!-- Wrapper Table -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f2f4f6; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.06);">

          <!-- HEADER (table layout instead of flex) -->
          <tr>
            <td bgcolor="#622120" style="padding:18px 24px; color:#ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <h1 class="header-title" style="margin:0; font-size:20px; font-weight:bold; color:#ffffff;">Bolsa de Trabajo</h1>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <div style="background:#ffffff; display:inline-block; padding:4px;">
                      <img src="https://upqroo.edu.mx/wp-content/uploads/2025/03/UPQROO-logo.png" width="130" alt="UPQROO" style="display:block; border:0;">
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td class="body-content" style="padding:24px; color:#333333; line-height:1.5; font-size:15px;">
              <p>Estimado(a) <strong>{{Nombre del representante / Empresa}}</strong>,</p>

              <p>La <strong>Universidad Politécnica de Quintana Roo</strong> te invita cordialmente a registrar tu empresa en la <strong>Bolsa de Trabajo Universitaria</strong>. Es una plataforma gratuita pensada para conectar empresas con nuestros estudiantes y egresados.</p>

              <p>Al registrarse podrá:</p>
              <ul style="margin:12px 0 18px 18px; padding:0;">
                <li>📢 Publicar ofertas de empleo y prácticas profesionales sin costo.</li>
                <li>🎓 Acceder a perfiles de estudiantes y egresados altamente capacitados.</li>
                <li>🤝 Fortalecer la vinculación con la universidad y participar en el desarrollo del talento local, regional e internacional.</li>
              </ul>

              <p style="text-align:center; margin:20px 0;">
                <!-- Button -->
                <a href="${process.env.NEXTAUTH_URL}/empresas-landing" target="_blank"
                   style="background-color:#622120; color:#ffffff; border:1px solid #622120; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; display:inline-block;">
                  Registrarse gratuitamente
                </a>
              </p>

              <p>Si requiere ayuda para completar el registro o desea publicar su primera oferta, responda este correo o contacte a nuestro equipo:</p>

              <p style="margin:6px 0;"><strong>Contacto:</strong><br>
                Vinculación y Gestión Empresarial • gestionempresarial@upqroo.edu.mx • Tel. 998 259 6180
              </p>

              <p>Agradecemos su interés y esperamos contar con su valiosa participación para generar oportunidades reales a nuestros estudiantes.</p>

              <p>Atentamente,<br>
              <strong>Universidad Politécnica de Quintana Roo — Área de Vinculación y Gestión Empresarial</strong></p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td bgcolor="#fafafa" style="padding:16px 24px; text-align:center; font-size:12px; color:#9aa0a6;">
              Universidad Politécnica de Quintana Roo — Av. Arco Bincentenario, Mza. 11, Lote 1119-33 Sm 255, 77500 • Cancún, Quintana Roo • 2025.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export interface EmpresaApiItem {
  id_empresa: number,
  empresa_rfc: string,
  empresa_nombre: string,
  empresa_direccion: string,
  empresa_email: string,
  empresa_telefono: string,
  empresa_tamano: string,
  empresa_sociedad: string,
  empresa_pagina_web: string | null
}

export type EmpresasApiResponse = EmpresaApiItem[]