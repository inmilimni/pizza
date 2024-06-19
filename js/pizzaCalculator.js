// Definir Selectores
const costoExtras = document.querySelector('#extras');
const costoManoDeObra = document.querySelector('#manoDeObra');
const ingresarOrden = document.querySelector('#ingresar-orden');
const cerrarCaja = document.querySelector('#cerrar-caja');
const ExtraSioNo = document.querySelector('#ExtrasSioNo');
const Ventas = document.querySelector('#btn-agregar');
const listaPizzas = document.querySelector('#lista_de_pizzas');
const costosFijosHTML = document.querySelector('#costos_fijos');
const costosVariablesHTML = document.querySelector('#costos_variables');
const costosTotalesHTML = document.querySelector('#costos_totales');
const costosTotalesXPizzaHTML = document.querySelector('#costos_totales_x_pizza');

// Definir constantes:
const PI = 3.14159;

//Definir Objeto Costos
const costos = {
    costoHarinaXCm: 0.03,
    costoExtras: '',
    costoManoDeObra: ''
}

// Definir lista de ordenes por pedido
let ordenes = [];

// Definir lista de pedidos por dia
let ordenesDia = [];

//Numero total de pizzas vendidades
//let pizzasVendidas = 0;

//Eventos
//Agregar a lista de ordenes por pedido
Ventas.addEventListener('click', () => {
    numPizzas = Number(document.querySelector('#cantidad').value);

    if(numPizzas > 0){
        //pizzasVendidas = pizzasVendidas + numPizzas;
        const variables = {
            pizzaRadio: '',
            ExtraVar: '',
            pizzaVendida: '',
            id: Date.now()
            }

        variables.pizzaVendida = numPizzas;
        variables.pizzaRadio = document.querySelector('#sizePizza').value;

        if(document.querySelector('#ExtrasSioNo').checked === true){
            variables.ExtraVar = 'Si';
        }else{
            variables.ExtraVar = 'No';
        }
        ordenes = [...ordenes, variables];
        crearHTML(ordenes);
    }else{
        alert("Ingrese un cantidad de pizzas valida");
    }
});

//Pasar Orden a la lista de diaria de ordenes
ingresarOrden.addEventListener('click', ()=>{
    ordenes.forEach(orden =>{
        ordenesDia = [...ordenesDia,orden];
    });
    ordenes = [];
    limpiarHTML(listaPizzas);
});

cerrarCaja.addEventListener('click', ()=>{
    let pizzasGVendidas = 0;
    let pizzaMVendidas = 0;
    let pizzaPVendidas = 0;
    let Extra = 0;

    if (costos.costoExtras === '' || costos.costoManoDeObra === ''){
        alert("Agregue los costos del dia de hoy antes de cerrar la caja.")
        mostrarCostos();
    }else{
        ordenesDia.forEach(pizza => {
            const {pizzaRadio, ExtraVar, pizzaVendida} = pizza
            console.log(pizza);
            if(pizza.pizzaRadio === 'Grande'){
                pizzasGVendidas = Number(pizzasGVendidas) + Number(pizza.pizzaVendida); 
            }else if(pizza.pizzaRadio === 'Mediana'){
                pizzaMVendidas = Number(pizzaMVendidas) + Number(pizza.pizzaVendida);   
            }else if(pizza.pizzaRadio === 'Pequeña'){
                pizzaPVendidas = Number(pizzaPVendidas)+ Number(pizza.pizzaVendida);
            }
            if(pizza.ExtraVar === 'Si'){
                Extra = Extra++;
            }
        })
        let VariablesG = area(8) * pizzasGVendidas * costos.costoHarinaXCm;
        let VariablesM = area(7) * pizzaMVendidas * costos.costoHarinaXCm;
        let VariablesP = area(5) * pizzaPVendidas * costos.costoHarinaXCm;
        let pizzasTotalesVendidas = pizzaPVendidas + pizzaMVendidas + pizzasGVendidas;
        let costosFijos = Number(costos.costoManoDeObra);
        let costosVariables = (Extra * costos.costoExtras) + VariablesG + VariablesM + VariablesP;
        let costosTotales = Number(costosFijos) + Number(costosVariables);
        let costosXPizza = Number(costosTotales / pizzasTotalesVendidas);
        crearHTMLCostos(costosFijos, costosVariables, costosTotales, costosXPizza);
        crearHTML(ordenesDia);
    }
})

// Mostrar - Ocultar menu de: Agregar Costos
function mostrarCostos() {
    document.getElementById("costos_desplegable").style.display = "block";
}
function ocultarCostos() {
    document.getElementById("costos_desplegable").style.display = "none";  
}

//Agregar costos
function agregarCostos() {
    costos.costoExtras = document.getElementById("costo_extra").value;
    costos.costoManoDeObra = document.getElementById("costo_mano_obra").value;
    ocultarCostos();

}

//Pintar lista de pizzas
function crearHTML(ordenes) {
  limpiarHTML(listaPizzas);

  if (ordenes.length > 0) {
    ordenes.forEach(pizza => {
      const li = document.createElement('li');
      const btnEliminar = document.createElement('a');
      btnEliminar.classList.add('borrar-linea');
      btnEliminar.innerText = 'X';

      btnEliminar.onclick = () => {
        borrarlinea(pizza.id, ordenes);
      }

      li.innerHTML = `<div>Pizza: <strong>${pizza.pizzaRadio}</strong></div> <div>Extra: <strong>${pizza.ExtraVar}</strong></div> <div>Cantidad: <strong>${pizza.pizzaVendida}</strong></div>`;
      li.appendChild(btnEliminar);
      listaPizzas.appendChild(li);
    });
  }
}

//Borrar lista de pizzas
function limpiarHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild)
    }
}

//Borar pizza de la lista de pizzas ordenadas
function borrarlinea(id, lista){
    lista = lista.filter(variables => variables.id !== id);
    ordenes = ordenes.filter(variables => variables.id !== id);
    ordenesDia = ordenesDia.filter(variables => variables.id !== id);
    crearHTML(lista);
}

//Calcular el área de la pizza utilizando la fórmula
function area (Radio){
    const area = PI * (Radio * Radio);
    return area;
};

//Calcular costos
function costosFijosF(pizzasVendidasDia){
    const costosFijos = costos.costoManoDeObra / pizzasVendidasDia;
    return costosFijos;
}

function costoTotal (costosFijosVar, costosVariableVar){
    const costoTotal = costosFijosVar + costosVariableVar;
}

//Mostrar Costos Fijos/Variable/Totales
function crearHTMLCostos(fijos, variables, totales, totalesXpizza) {
    limpiarHTML(costosVariablesHTML);
    let C1 = document.createElement('p');
    C1.innerHTML = `${variables.toFixed(2)}`;
    C1.className = "resultados";
    costosVariablesHTML.appendChild(C1);

    limpiarHTML(costosFijosHTML);
    let C2 = document.createElement('p');
    C2.innerHTML = `${fijos.toFixed(2)}`;
    C2.className = "resultados";
    costosFijosHTML.appendChild(C2);

    limpiarHTML(costosTotalesHTML);
    let C3 = document.createElement('p');
    C3.innerHTML = `${totales.toFixed(2)}`;
    C3.className = "resultados";
    costosTotalesHTML.appendChild(C3);

    limpiarHTML(costosTotalesXPizzaHTML);
    let C4 = document.createElement('p');
    C4.innerHTML = `${totalesXpizza.toFixed(2)}`;
    C4.className = "resultados";
    costosTotalesXPizzaHTML.appendChild(C4);
}
