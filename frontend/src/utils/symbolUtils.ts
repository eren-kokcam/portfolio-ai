export const normalizeSymbol = (s: string): string =>
    s.replace(/İ/g, 'I').replace(/ı/g, 'i')
     .replace(/Ş/g, 'S').replace(/ş/g, 's')
     .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
     .replace(/Ü/g, 'U').replace(/ü/g, 'u')
     .replace(/Ö/g, 'O').replace(/ö/g, 'o')
     .replace(/Ç/g, 'C').replace(/ç/g, 'c')
     .toUpperCase();