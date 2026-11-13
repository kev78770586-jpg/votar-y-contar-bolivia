// Conversor de números a texto en mayúsculas para actas electorales oficiales de Bolivia
export function numeroALetras(num) {
  if (num === null || num === undefined || isNaN(num)) return "CERO";
  num = Math.floor(Math.abs(num));
  if (num === 0) return "CERO";

  const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const especiales = {
    10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE", 15: "QUINCE",
    16: "DIECISÉIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE",
    20: "VEINTE", 21: "VEINTIUNO", 22: "VEINTIDÓS", 23: "VEINTITRÉS", 24: "VEINTICUATRO",
    25: "VEINTICINCO", 26: "VEINTISÉIS", 27: "VEINTISIETE", 28: "VEINTIOCHO", 29: "VEINTINUEVE"
  };
  const decenas = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const centenas = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

  function convertirGrupo(n) {
    let salida = "";
    if (n === 100) return "CIEN";
    if (n > 100) {
      const c = Math.floor(n / 100);
      salida += (c === 1 ? "CIENTO " : centenas[c] + " ");
      n = n % 100;
    }

    if (n >= 10 && n <= 29) {
      salida += especiales[n];
      return salida.trim();
    } else if (n >= 30) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      salida += decenas[d];
      if (u > 0) salida += " Y " + unidades[u];
      return salida.trim();
    } else if (n > 0) {
      salida += unidades[n];
      return salida.trim();
    }
    return salida.trim();
  }

  if (num < 1000) {
    return convertirGrupo(num);
  } else if (num === 1000) {
    return "MIL";
  } else if (num < 2000) {
    return ("MIL " + convertirGrupo(num % 1000)).trim();
  } else {
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    return (convertirGrupo(miles) + " MIL " + (resto > 0 ? convertirGrupo(resto) : "")).trim();
  }
}
