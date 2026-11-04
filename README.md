# Rifas Denilson - Frontend

## Rifas e historial

- El inicio presenta una rifa activa y permite entrar a las demas rifas activas.
- Antes del footer aparece el carrusel de rifas anteriores, incluso si no hay ninguna activa.
- `/rifas/:raffleId` muestra la rifa seleccionada. Si esta cerrada, solo presenta su informacion, premios y consulta de numeros por correo; no muestra compras ni metodos de pago.
- El panel permite seleccionar cada rifa y consultar sus compras, pagos y ranking sin mezclar datos. Crear una nueva no reemplaza las anteriores.
- Cerrar conserva el historial y requiere resolver primero las compras pendientes. Ocultar y cerrar son acciones distintas.
- El modal de comprobantes muestra directamente la imagen Base64 o URL entregada por el backend, sin recortar rutas. Si no puede cargarla, muestra un aviso.

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
