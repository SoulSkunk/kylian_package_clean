import { describe, expect, it } from "vitest";
import { formatDate, capitalize } from "./module";

describe("formatDate", () => {
  it("formate une date ISO valide en français", () => {
    // On vérifie que le résultat contient l'année et le jour
    const result = formatDate("1990-05-20");
    expect(result).toContain("1990");
    expect(result).toContain("20");
  });

  it("retourne une chaîne vide pour une date vide", () => {
    expect(formatDate("")).toBe("");
  });

  it("retourne une chaîne vide pour une date invalide", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("retourne une chaîne vide pour null", () => {
    expect(formatDate(null)).toBe("");
  });
});

describe("capitalize", () => {
  it("capitalise la première lettre d'un mot en minuscules", () => {
    expect(capitalize("jean")).toBe("Jean");
  });

  it("ne modifie pas un mot déjà en majuscule", () => {
    expect(capitalize("Jean")).toBe("Jean");
  });

  it("retourne une chaîne vide pour une chaîne vide", () => {
    expect(capitalize("")).toBe("");
  });

  it("retourne une chaîne vide pour null", () => {
    expect(capitalize(null)).toBe("");
  });

  it("retourne une chaîne vide pour undefined", () => {
    expect(capitalize(undefined)).toBe("");
  });

  it("capitalise un seul caractère", () => {
    expect(capitalize("a")).toBe("A");
  });
});
