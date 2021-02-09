const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarBusqueda);
});

function validarBusqueda(e) {
    e.preventDefault();
    const busqueda = document.querySelector('#busqueda').value;

    if (busqueda.length < 3) {
        mostrarMensaje('Busqueda muy corta... Añade más informacion');
        return;
    }

    consultarAPI(busqueda);
}

function consultarAPI(busqueda) {
    const githubUrl = `https://jobs.github.com/positions.json?search=${busqueda}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(githubUrl)}`;
    spinner();
    axios.get(url)
        .then(respuesta => mostrarVacantes(JSON.parse(respuesta.data.contents)))
}

function mostrarVacantes(vacantes) {
    limpiarHTML();
    if (vacantes.length > 0) {
        resultado.classList.add('grid');

        vacantes.forEach(vacante => {
            const { company, title, type, url } = vacante;
            resultado.innerHTML += `
            <div class="shadow bg-white p-6 rounded">
                <h2 class="text-2xl font-light mb-4">${title}</h2>
                <p class="font-bold uppercase">Compañia:  <span class="font-light normal-case">${company} </span></p>
                <p class="font-bold uppercase">Tipo de Contrato:   <span class="font-light normal-case">${type} </span></p>
                <a class="bg-teal-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center" href="${url}" target="_blank">Ver Vacante</a>
            </div>
            `;
        });
    } else {

        const noResultado = document.createElement('p');
        noResultado.classList.add('text-center', 'mt-10', 'text-gray-600', 'w-full');
        resultado.classList.remove('grid');
        noResultado.textContent = `No se encontraron empleos disponibles para ${document.querySelector('#busqueda').value}`;
        resultado.appendChild(noResultado);
    }
}


function mostrarMensaje(mensaje) {
    const existe = document.querySelector('.bg-gray-100');
    if (!existe) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-gray-100', 'p-3', 'text-center', 'mt-3', 'alerta');
        alerta.textContent = mensaje;

        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    resultado.classList.remove('grid');
    const cargando = document.createElement('div');
    cargando.classList.add('spinner');
    cargando.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;
    resultado.appendChild(cargando);
}