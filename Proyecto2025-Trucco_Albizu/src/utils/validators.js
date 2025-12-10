export const soloLetras = (texto) => {
  if (!texto || texto.length === 0) {
    return true;
  }

  const letrasPermitidas = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "á",
    "é",
    "í",
    "ó",
    "ú",
    "Á",
    "É",
    "Í",
    "Ó",
    "Ú",
    "ñ",
    "Ñ",
  ];

  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];
    if (!letrasPermitidas.includes(caracter)) {
      return false;
    }
  }

  return true;
};
