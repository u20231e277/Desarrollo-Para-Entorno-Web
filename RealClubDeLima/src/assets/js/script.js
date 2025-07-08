// ==========================
// DATA DISPONIBLE PARA ANGULAR
// ==========================
let DATA = {
  ambientes: [
    {
      id: 1,
      nombre: "Cancha 01 - Tenis de campo",
      descripcion: "Tenis de campo, exclusivo para asociados y sus invitados. Cancha 1.",
      price: {
        socios: 0,
        invitados: {
          adultos: 50,
          niños: 20
        }
      },
      horarios: [
        {
          id: 1,
          fecha: "Jueves 13",
          horarios: [
            { id: 1, inicio: "09:00", fin: "10:00", disponible: true },
            { id: 2, inicio: "10:00", fin: "11:00", disponible: true },
            { id: 3, inicio: "11:00", fin: "12:00", disponible: true },
            { id: 4, inicio: "12:00", fin: "13:00", disponible: true }
          ]
        }
      ]
    },
    {
      id: 2,
      nombre: "Cancha 02 - Tenis de campo",
      descripcion: "Tenis de campo, exclusivo para asociados y sus invitados. Cancha 2.",
      price: {
        socios: 0,
        invitados: {
          adultos: 40,
          niños: 15
        }
      },
      horarios: [
        {
          id: 1,
          fecha: "Jueves 13",
          horarios: [
            { id: 1, inicio: "09:00", fin: "10:00", disponible: true },
            { id: 2, inicio: "10:00", fin: "11:00", disponible: true },
            { id: 3, inicio: "11:00", fin: "12:00", disponible: true },
            { id: 4, inicio: "12:00", fin: "13:00", disponible: true }
          ]
        }
      ]
    },
    {
      id: 3,
      nombre: "Cancha de Fútbol 12 Personas",
      descripcion: "Cancha de fútbol, exclusivo para asociados y sus invitados. Aforo máximo de 12 personas",
      price: {
        socios: 0,
        invitados: {
          adultos: 55,
          niños: 25
        }
      },
      horarios: [
        {
          id: 1,
          fecha: "Jueves 13",
          horarios: [
            { id: 1, inicio: "09:00", fin: "10:00", disponible: true }
          ]
        }
      ]
    },
    {
      id: 4,
      nombre: "Cancha de Fútbol 6 Personas",
      descripcion: "Cancha de fútbol, exclusivo para asociados y sus invitados. Aforo máximo de 6 personas",
      price: {
        socios: 0,
        invitados: {
          adultos: 40,
          niños: 10
        }
      },
      horarios: [
        {
          id: 1,
          fecha: "Jueves 13",
          horarios: [
            { id: 1, inicio: "09:00", fin: "10:00", disponible: true }
          ]
        }
      ]
    }
  ]
};

// Exportar para Angular
window.DATA = DATA;

/* ===== Código comentado por migración a Angular =====

// document.addEventListener("DOMContentLoaded", () => {
//   getAmbientes();
// });

// const getAmbientes = () => {
//   DATA.ambientes.forEach((ambiente, index) => {
//     if (index > 3) return;
//     const searchResult = document.createElement("li");
//     searchResult.innerHTML = `
//       <label>
//         <input type="radio" name="area" data-id="${ambiente.id}" />
//         <span class="radio-custom"></span>
//         ${ambiente.nombre}
//       </label>`;
//     document.querySelector(".select-area .area-list").appendChild(searchResult);
//   });
// };

// document.querySelector(".search-input").addEventListener("keyup", (event) => {
//   const searchValue = event.target.value;
//   const searchResultsList = document.querySelector(".select-area .area-list");
//   searchResultsList.innerHTML = "";
//   if (searchValue.length < 4) {
//     getAmbientes();
//     return;
//   }
//   const searchResults = DATA.ambientes.filter((ambiente) =>
//     ambiente.nombre.toLowerCase().includes(searchValue.toLowerCase())
//   );
//   searchResults.forEach((ambiente) => {
//     const searchResult = document.createElement("li");
//     searchResult.innerHTML = `
//       <label>
//         <input type="radio" name="area" data-id="${ambiente.id}" />
//         <span class="radio-custom"></span>
//         ${ambiente.nombre}
//       </label>`;
//     searchResultsList.appendChild(searchResult);
//   });
// });

*/

