# Laboratorio de tecnologías JavaScript y AJAX

Sitio interactivo del laboratorio, desarrollado sobre la plantilla Astro proporcionada y con un diseño profesional, adaptable a móviles.

## Contenido

- Detección de palíndromos.
- Comparación de dos números.
- Extracción de las vocales que aparecen en una frase.
- Recuento de a, e, i, o y u, contando las vocales acentuadas junto a su vocal base.
- Petición AJAX con `XMLHttpRequest`, URL actual por defecto, estados `readyState`, cuerpo, cabeceras HTTP y código de estado.

## Ejecutar localmente

Se requiere Node.js y npm. Desde la carpeta del proyecto:

```sh
npm install
npm run dev
```

Para generar la versión estática:

```sh
npm run build
```

El resultado se guarda en `dist/`. Puedes abrir `dist/index.html` directamente para revisar el diseño; para que el ejercicio AJAX consulte una página por HTTP, ejecútalo con `npm run dev` o usa la dirección publicada.

## Publicación

El proyecto está configurado para GitHub Pages en `https://diegoroo.github.io/laboratorio-js-ajax/`. El archivo `.github/workflows/deploy.yml` compila y publica el sitio cuando se suben cambios a la rama `main`. En la configuración del repositorio, selecciona **Settings → Pages → Build and deployment → GitHub Actions**.

Si se cambia el nombre del repositorio, actualiza `base` en `astro.config.mjs` para que coincida.
