# Rifas Denilson - Frontend

## Rifas e historial

- El inicio presenta una rifa activa y permite entrar a las demas rifas activas.
- Antes del footer aparece el carrusel de rifas anteriores, incluso si no hay ninguna activa.
- `/rifas/:raffleId` muestra la rifa seleccionada. Si esta cerrada, solo presenta su informacion, premios y consulta de numeros por correo; no muestra compras ni metodos de pago.
- El panel permite seleccionar cada rifa y consultar sus compras, pagos y ranking sin mezclar datos. Crear una nueva no reemplaza las anteriores.
- Cerrar conserva el historial y requiere resolver primero las compras pendientes. Ocultar y cerrar son acciones distintas.
- El modal de comprobantes muestra directamente la imagen Base64 o URL entregada por el backend, sin recortar rutas. Si no puede cargarla, muestra un aviso.
- El admin carga primero la rifa actual; el selector recibe las otras rifas en segundo plano y sus detalles solo al seleccionarlas. Los comprobantes se descargan al abrirlos y se reutilizan durante la sesion de esa rifa.
- Editar una compra actualiza solo su fila, sin volver a descargar la tabla. Solo las aprobadas muestran Eliminar: requiere confirmacion, libera los numeros y conserva una copia de auditoria en el backend. Las pendientes se rechazan y las rechazadas no aparecen en ningun listado. Las rifas cerradas siguen siendo de solo consulta.
- El selector esta en el sidebar, antes de Gestion, y queda deshabilitado si solo hay una rifa. La seccion **Rifas** contiene la rifa seleccionada arriba, las anteriores debajo, enlaces para consultar cada una y el boton Crear nueva rifa; ese boton ya no aparece en el header general. `?rifa=ID&seccion=rifas` permite abrir directamente su informacion.
- Aprobar guarda los numeros y responde sin esperar el correo. El panel muestra correo en cola, enviando, pendiente de reintento, enviado o fallido; el estado se consulta sin descargar de nuevo la tabla. Reenviar tampoco bloquea esperando al proveedor. Los errores de envio no revierten la aprobacion ni generan nuevos numeros.
- Editar el contacto solo envia cantidad y metodo de pago si cambiaron, para evitar lecturas y recalculos innecesarios. La seccion Rifas no descarga tickets hasta entrar en su listado.

## Desarrollo

```powershell
npm.cmd ci
$env:VITE_API_URL = "http://localhost:5000"
npm.cmd run dev
```

`VITE_API_URL` es opcional; sin esta variable se usa el backend de Railway configurado en los servicios.
Para produccion, configurar explicitamente `VITE_API_URL` en Vercel con el origen HTTPS del backend, sin `/api` ni barra final, y volver a desplegar. No poner claves de MongoDB, Brevo ni el token administrador en variables `VITE_`: se publican en el navegador.
La plantilla `.env.example` no contiene secretos. Vercel debe desplegar la rama `master`, ejecutar `npm run build` y publicar `dist`. Las reglas de `vercel.json` cubren los enlaces directos de `/rifas/:raffleId`.
Para validar: `npm.cmd run build`.
El despliegue debe coordinarse con el backend actualizado y su migracion de `raffleId`; consultar la [guia del backend](../my-raffles-back/README.md) antes de habilitar compras.

## Base tecnica

React, TypeScript, Vite, Tailwind, React Router y Swiper.
