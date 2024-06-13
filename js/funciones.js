const nombre = document.querySelector('.nombre');
const numero = document.querySelector('.numero');
const direccion = document.querySelector('.direccion');
const btnAgregarContacto = document.querySelector('.btn-agregar-tareas');
const tablaContactos = document.querySelector('.Listado-Tareas');
const db = window.localStorage;
var errores = [];

btnAgregarContacto.onclick = () => {

    errores = [];

    if (nombre.value === '' || numero.value === '' || direccion.value === '') {
        errores.push("Por favor, complete todos los campos antes de agregar un contacto.");
    } else {

    }
    if (/\d/.test(nombre.value)) {
        errores.push('El nombre no puede contener números.');
    }
    if (!/^\d{8}$/.test(numero.value)) {
        errores.push('El teléfono no es válido. Debe tener exactamente 8 dígitos.');
    }

    if (errores.length > 0) {
        alert(errores.join('\n'));
    } else {
        let contacto = {
            id: Math.random().toString(36).substr(2, 9),
            nombre: nombre.value,
            numero: numero.value,
            direccion: direccion.value,
            recordatorios: []
        };
        guardarContacto(db, contacto);
        limpiarFormulario();
    }


};

const eliminarContacto = (contactoId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
        db.removeItem(contactoId);
        const trContacto = document.querySelector(`[data-id='${contactoId}']`);
        trContacto.parentNode.removeChild(trContacto);
    }
};

const guardarContacto = (db, contacto) => {
    db.setItem(contacto.id, JSON.stringify(contacto));
    crearContacto(tablaContactos, contacto, db);
};

const cargarContactos = (db, parentNode) => {
    let claves = Object.keys(db);
    for (let clave of claves) {
        let contacto = JSON.parse(db.getItem(clave));
        crearContacto(parentNode, contacto, db);
    }
};

const crearContacto = (parentNode, contacto, db) => {
    let trContacto = document.createElement('tr');
    trContacto.dataset.id = contacto.id;

    let tdNombre = document.createElement('td');
    let tdNumero = document.createElement('td');
    let tdDireccion = document.createElement('td');
    let tdAcciones = document.createElement('td');
    let iconoBorrar = document.createElement('span');
    let iconoWhatsApp = document.createElement('span');
    let iconoEditar = document.createElement('span');
    let iconoLlamar = document.createElement('a');


    tdNombre.textContent = contacto.nombre;
    tdNumero.textContent = contacto.numero;
    tdDireccion.textContent = contacto.direccion;
    iconoBorrar.innerHTML = 'delete_forever';
    iconoWhatsApp.innerHTML = 'add_alert';
    iconoEditar.innerHTML = 'edit';
    iconoLlamar.innerHTML = 'call';

    iconoBorrar.classList.add('material-icons', 'borrar');
    iconoWhatsApp.classList.add('material-icons', 'record');
    iconoEditar.classList.add('material-icons', 'editar');
    iconoLlamar.classList.add('material-icons', 'llamar');
    <!-- La funcion 'tel:' sirve para crear un enlace telefónico -->
    iconoLlamar.href = `tel:${contacto.numero}`;

    iconoBorrar.onclick = () => {
        eliminarContacto(contacto.id);
    };

    iconoWhatsApp.onclick = () => {
        abrirModal(contacto.id);
    };

    iconoEditar.onclick = () => {
        editarContacto(contacto);
    };

    tdAcciones.appendChild(iconoBorrar);
    tdAcciones.appendChild(iconoWhatsApp);
    tdAcciones.appendChild(iconoEditar);
    tdAcciones.appendChild(iconoLlamar);

    trContacto.appendChild(tdNombre);
    trContacto.appendChild(tdNumero);
    trContacto.appendChild(tdDireccion);
    trContacto.appendChild(tdAcciones);

    parentNode.appendChild(trContacto);

    if (contacto.recordatorios && contacto.recordatorios.length > 0) {
        contacto.recordatorios.forEach(recordatorio => {
            crearRecordatorio(trContacto, contacto, recordatorio, db);
        });
    }
};

const editarContacto = (contacto) => {
    nombre.value = contacto.nombre;
    numero.value = contacto.numero;
    direccion.value = contacto.direccion;

    btnAgregarContacto.onclick = () => {
        errores = [];

        if (nombre.value === '' || numero.value === '' || direccion.value === '') {
            errores.push("Por favor, complete todos los campos antes de editar el contacto.");
        } else {

        }
        if (/\d/.test(nombre.value)) {
            errores.push('El nombre no puede contener números.');
        }
        if (!/^\d{8}$/.test(numero.value)) {
            errores.push('El teléfono no es válido. Debe tener exactamente 8 dígitos.');
        }

        if (errores.length > 0) {
            alert(errores.join('\n'));
        } else {
            contacto.nombre = nombre.value;
            contacto.numero = numero.value;
            contacto.direccion = direccion.value;

            db.setItem(contacto.id, JSON.stringify(contacto));


            const trContacto = document.querySelector(`[data-id='${contacto.id}']`);
            trContacto.querySelector('td:nth-child(1)').textContent = contacto.nombre;
            trContacto.querySelector('td:nth-child(2)').textContent = contacto.numero;
            trContacto.querySelector('td:nth-child(3)').textContent = contacto.direccion;

            limpiarFormulario();
            btnAgregarContacto.onclick = agregarContacto;
        };
    }
};

const limpiarFormulario = () => {
    nombre.value = '';
    numero.value = '';
    direccion.value = '';
};

document.addEventListener('DOMContentLoaded', () => {
    cargarContactos(db, tablaContactos);
});

const modal = document.getElementById("modalRecordatorio");
const span = document.getElementsByClassName("close")[0];
const btnGuardarRecordatorio = document.getElementById("btnGuardarRecordatorio");
let contactoIdActual;

const abrirModal = (contactoId) => {
    contactoIdActual = contactoId;
    modal.style.display = "block";
};

span.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

btnGuardarRecordatorio.onclick = () => {
    const recordatorioTexto = document.getElementById("recordatorioTexto").value;
    const recordatorioFecha = document.getElementById("recordatorioFecha").value;

    if (recordatorioTexto.trim() === '' || recordatorioFecha.trim() === '') {
        alert("Por favor, complete ambos campos del recordatorio.");
        return;
    }

    let contacto = JSON.parse(db.getItem(contactoIdActual));
    let nuevoRecordatorio = { texto: recordatorioTexto, fecha: recordatorioFecha };
    contacto.recordatorios.push(nuevoRecordatorio);
    db.setItem(contactoIdActual, JSON.stringify(contacto));
    modal.style.display = "none";
    actualizarContactoEnUI(contactoIdActual, nuevoRecordatorio);
};

const actualizarContactoEnUI = (contactoId, recordatorio) => {
    let trContacto = document.querySelector(`[data-id='${contactoId}']`);
    let contacto = JSON.parse(db.getItem(contactoId));
    crearRecordatorio(trContacto, contacto, recordatorio, db);
};

const crearRecordatorio = (parentNode, contacto, recordatorio, db) => {
    let divRecordatorio = document.createElement('div');
    let textoRecordatorio = document.createElement('p');
    let fechaRecordatorio = document.createElement('p');
    let iconoEnviarWhatsApp = document.createElement('span');
    let iconoEliminarRecordatorio = document.createElement('span');

    textoRecordatorio.innerHTML = `Recordatorio: ${recordatorio.texto}`;
    fechaRecordatorio.innerHTML = `Fecha: ${recordatorio.fecha}`;
    iconoEnviarWhatsApp.innerHTML = 'send';
    iconoEliminarRecordatorio.innerHTML = 'delete_forever';

    divRecordatorio.classList.add('Recordatorio');
    iconoEnviarWhatsApp.classList.add('material-icons', 'enviar');
    iconoEliminarRecordatorio.classList.add('material-icons', 'borrar');

    iconoEnviarWhatsApp.onclick = () => {
        enviarWhatsApp(contacto.numero, recordatorio.texto, recordatorio.fecha);
    };

    iconoEliminarRecordatorio.onclick = () => { // Acción al hacer clic en el botón de eliminar
        if (confirm("¿Estás seguro de que quieres eliminar este recordatorio?")) {
            let index = contacto.recordatorios.indexOf(recordatorio);
            contacto.recordatorios.splice(index, 1); // Eliminar el recordatorio del array
            db.setItem(contacto.id, JSON.stringify(contacto)); // Actualizar en el almacenamiento
            parentNode.removeChild(divRecordatorio); // Eliminar el div del recordatorio de la UI
        }
    };

    divRecordatorio.appendChild(textoRecordatorio);
    divRecordatorio.appendChild(fechaRecordatorio);
    divRecordatorio.appendChild(iconoEnviarWhatsApp);
    divRecordatorio.appendChild(iconoEliminarRecordatorio);

    parentNode.appendChild(divRecordatorio);
};

const enviarWhatsApp = (numero, texto, fecha) => {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(`Recordatorio: ${texto} en la fecha ${fecha}`)}`;
    window.open(url, '_blank');
};
