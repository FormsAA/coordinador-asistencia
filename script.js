document.getElementById('eventoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btnSubmit = document.querySelector("#eventoForm button[type='submit']");
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Guardando...";

  const tipo = document.getElementById('tipo').value;
  const tema = document.getElementById('tema').value;
  const subtemas = document.getElementById('subtemas').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const duracion = document.getElementById('duracion').value;
  const facilitador = document.getElementById('facilitador').value;

  const sessionId = Date.now().toString(36);
  const baseUrl = "https://formsaa.github.io/Asistencias/";
  const fullUrl = `${baseUrl}?id=${sessionId}`;

  const formData = new URLSearchParams({
      tipo,
      tema,
      subtemas,
      fecha,
      hora,
      duracion,
      facilitador,
      id: sessionId
  });

  try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxPgybyYJ6hGwXYlY7AE2i5WactBWY1Ec-KYUlL_l1CHI5VxjAxPKpIFKRdrJFdGZi2eQ/exec', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();

      if (result.status === 'ok') {
          document.getElementById('qr').style.display = 'block';
          document.getElementById('qr-url').textContent = fullUrl;

          QRCode.toCanvas(document.getElementById('qrcode'), fullUrl, function (error) {
              if (error) console.error("❌ Error al generar el QR:", error);
          });

          limpiarCamposEvento();
      } else {
          alert("❌ No se pudo guardar la sesión: " + result.message);
      }
  } catch (error) {
      console.error("❌ Error al conectar con Apps Script:", error);
      alert("No se pudo conectar con el servidor.");
  } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Generar QR";
  }
});

function limpiarCamposEvento() {
  document.getElementById('tipo').value = "";
  document.getElementById('tema').value = "";
  document.getElementById('subtemas').value = "";
  document.getElementById('fecha').value = "";
  document.getElementById('hora').value = "";
  document.getElementById('duracion').value = "";
  document.getElementById('facilitador').value = "";
}
