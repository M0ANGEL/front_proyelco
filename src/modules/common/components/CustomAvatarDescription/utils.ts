export const generarNumeroAleatorio = (numero = 2) => {
  return parseInt(numero.toString().slice(-1));
};

export const obtenerIniciales = (name = "No Name") => {
  const palabras = name.trim().split(" ");
  const iniciales = [];

  switch (palabras.length) {
    case 1:
      // if (palabras[0].length < 1) {
      //   throw new Error("El nombre debe tener al menos 2 caracteres");
      // }
      iniciales.push(palabras[0][0].toUpperCase());
      break;
    case 2:
      // if (palabras[0].length < 1 || palabras[1].length < 1) {
      //   throw new Error(
      //     "El nombre y el apellido deben tener al menos 2 caracteres cada uno"
      //   );
      // }
      iniciales.push(palabras[0][0].toUpperCase());
      iniciales.push(palabras[1][0].toUpperCase());
      break;
    case 3:
      // if (
      //   palabras[0].length < 1 ||
      //   palabras[1].length < 1 ||
      //   palabras[2].length < 1
      // ) {
      //   throw new Error(
      //     "El primer y segundo nombre deben tener al menos 2 caracteres, y el apellido debe tener al menos 3 caracteres"
      //   );
      // }
      iniciales.push(palabras[0][0].toUpperCase());
      iniciales.push(palabras[2][0].toUpperCase());
      break;

    case 4:
      // if (
      //   palabras[0].length < 2 ||
      //   palabras[1].length < 2 ||
      //   palabras[2].length < 3 ||
      //   palabras[3].length < 3
      // ) {
      //   throw new Error(
      //     "El primer y segundo nombre deben tener al menos 2 caracteres, y el apellido debe tener al menos 3 caracteres"
      //   );
      // }
      iniciales.push(palabras[0][0].toUpperCase());
      iniciales.push(palabras[2][0].toUpperCase());
      break;
    default:
      throw new Error("El nombre completo no tiene un formato válido");
  }
  return iniciales.join("");
};
