const $ = (selector) => document.querySelector(selector);

function normalizeLetters(text) {
  return text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zñ]/g, '');
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  const exercise = form.dataset.exercise;
  if (!exercise) return;
  event.preventDefault();

  if (exercise === 'palindrome') {
    const original = $('#phraseInput').value.trim();
    const normalized = normalizeLetters(original);
    const reversed = [...normalized].reverse().join('');
    $('#palindromeResult').textContent = normalized && normalized === reversed
      ? `«${original}» sí es un palíndromo.`
      : `«${original}» no es un palíndromo.`;
  }

  if (exercise === 'greater') {
    const first = Number($('#numberOne').value);
    const second = Number($('#numberTwo').value);
    $('#greaterResult').textContent = first === second
      ? `Los dos números son iguales: ${first}.`
      : `El mayor es ${Math.max(first, second)}.`;
  }

  if (exercise === 'vowels') {
    const phrase = $('#vowelsInput').value;
    const found = [...phrase].filter((character) => /[aeiouáéíóúü]/i.test(character));
    $('#vowelsResult').textContent = found.length
      ? `Vocales encontradas (${found.length}): ${found.join(', ')}`
      : 'La frase no contiene vocales.';
  }

  if (exercise === 'count') {
    const normalized = $('#countInput').value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const counts = Object.fromEntries(['a', 'e', 'i', 'o', 'u'].map((vowel) => [vowel, [...normalized].filter((character) => character === vowel).length]));
    $('#countResult').textContent = `a: ${counts.a} · e: ${counts.e} · i: ${counts.i} · o: ${counts.o} · u: ${counts.u}`;
  }
});

const requestForm = $('#requestForm');
const urlInput = $('#urlInput');
const stateOutput = $('#requestState');
const contentOutput = $('#responseContent');
const headersOutput = $('#responseHeaders');
const statusOutput = $('#responseStatus');
const statusDot = $('#statusDot');
const readyStateLabels = {
  0: 'No iniciada',
  1: 'Conexión abierta',
  2: 'Cabeceras recibidas',
  3: 'Cargando contenido',
  4: 'Completada'
};

// La URL actual cumple el valor inicial requerido; el fragmento no forma parte de la petición HTTP.
urlInput.value = window.location.href.split('#')[0];

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let target;
  try {
    target = new URL(urlInput.value.trim());
    if (!['http:', 'https:'].includes(target.protocol)) throw new Error('protocol');
  } catch {
    stateOutput.textContent = 'URL no válida. Introduce una dirección que comience por http:// o https://.';
    statusDot.className = 'status-dot error';
    return;
  }

  const xhr = new XMLHttpRequest();
  contentOutput.textContent = 'Esperando respuesta…';
  headersOutput.textContent = 'Esperando cabeceras…';
  statusOutput.textContent = 'Esperando código de estado…';
  statusDot.className = 'status-dot loading';
  stateOutput.textContent = 'Preparando la petición…';

  xhr.onreadystatechange = () => {
    const stateName = readyStateLabels[xhr.readyState] || 'Estado desconocido';
    const suffix = xhr.readyState === 4 && xhr.status
      ? ` · HTTP ${xhr.status} ${xhr.statusText}`
      : '';
    stateOutput.textContent = `${stateName} (readyState ${xhr.readyState})${suffix}.`;

    if (xhr.readyState === 2) {
      headersOutput.textContent = xhr.getAllResponseHeaders().trim() || 'El servidor no devolvió cabeceras visibles.';
      statusOutput.textContent = `${xhr.status} ${xhr.statusText || 'Sin texto de estado'}`;
    }

    if (xhr.readyState === 4) {
      contentOutput.textContent = xhr.responseText || '(La respuesta no contiene texto.)';
      headersOutput.textContent = xhr.getAllResponseHeaders().trim() || 'El servidor no devolvió cabeceras visibles.';
      statusOutput.textContent = `${xhr.status} ${xhr.statusText || (xhr.status === 0 ? 'Sin respuesta HTTP' : 'Sin texto de estado')}`;
      statusDot.className = xhr.status >= 200 && xhr.status < 400 ? 'status-dot done' : 'status-dot error';
    }
  };

  xhr.onerror = () => {
    stateOutput.textContent = 'Error de red o bloqueo CORS: el navegador no permitió leer la respuesta.';
    contentOutput.textContent = 'No se pudo acceder al contenido. Comprueba la URL, tu conexión y si el servidor permite peticiones desde este origen.';
    headersOutput.textContent = 'No hay cabeceras disponibles.';
    statusOutput.textContent = '0 — Sin respuesta HTTP accesible.';
    statusDot.className = 'status-dot error';
  };

  xhr.ontimeout = () => {
    stateOutput.textContent = 'La petición superó el tiempo máximo de espera.';
    contentOutput.textContent = 'No se recibió contenido antes del límite de tiempo.';
    statusOutput.textContent = `${xhr.status || 0} ${xhr.statusText || 'Tiempo agotado'}`;
    statusDot.className = 'status-dot error';
  };

  try {
    xhr.open('GET', target.href, true);
    xhr.timeout = 20000;
    xhr.send();
  } catch (error) {
    stateOutput.textContent = `No se pudo iniciar la petición: ${error.message}`;
    statusOutput.textContent = '0 — Petición no iniciada.';
    statusDot.className = 'status-dot error';
  }
});
