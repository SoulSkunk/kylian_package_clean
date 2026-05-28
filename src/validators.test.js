import {
  isValidEmail,
  isValidName,
  isValidZipcode,
  isAdult,
  calculateAge,
  validateForm,
} from "./validators";

describe("calculateAge", () => {
  it("retourne l'âge exact en années entières", () => {
    const today = new Date();
    // Personne née il y a exactement 25 ans aujourd'hui
    const birthdate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate(),
    );
    expect(calculateAge(birthdate.toISOString().split("T")[0])).toBe(25);
  });

  it("retourne l'âge correct avant l'anniversaire de l'année", () => {
    const today = new Date();
    // Personne née le 2 janvier : si aujourd'hui est après le 2 janvier elle a son âge normal,
    // on cherche un cas où l'anniversaire n'est pas encore passé cette année.
    // On prend le mois suivant pour être sûr que l'anniversaire n'est pas encore passé.
    const nextMonth = (today.getMonth() + 1) % 12;
    const yearOffset = today.getMonth() === 11 ? 1 : 0; // si décembre, le mois suivant est janvier de l'an prochain
    const birthYear = today.getFullYear() - 30 - yearOffset;
    const birthdate = new Date(birthYear, nextMonth, 15);
    // L'anniversaire de cette personne est le 15 du mois prochain → elle a encore 29 ans
    expect(calculateAge(birthdate.toISOString().split("T")[0])).toBe(29);
  });

  it("retourne -1 pour une chaîne vide", () => {
    expect(calculateAge("")).toBe(-1);
  });

  it("retourne -1 pour une date invalide", () => {
    expect(calculateAge("not-a-date")).toBe(-1);
  });

  it("retourne -1 pour une valeur null/undefined", () => {
    expect(calculateAge(null)).toBe(-1);
    expect(calculateAge(undefined)).toBe(-1);
  });
});

describe("isAdult", () => {
  it("retourne true pour une personne ayant exactement 18 ans aujourd'hui", () => {
    const today = new Date();
    const exactlyAdult = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    expect(isAdult(exactlyAdult.toISOString().split("T")[0])).toBe(true);
  });

  it("retourne true pour une personne de plus de 18 ans", () => {
    const adultDate = new Date();
    adultDate.setFullYear(adultDate.getFullYear() - 18);
    adultDate.setDate(adultDate.getDate() - 1);
    expect(isAdult(adultDate.toISOString().split("T")[0])).toBe(true);
  });

  it("retourne false pour un mineur de 17 ans", () => {
    const minorDate = new Date();
    minorDate.setFullYear(minorDate.getFullYear() - 17);
    expect(isAdult(minorDate.toISOString().split("T")[0])).toBe(false);
  });

  it("retourne false pour une date invalide", () => {
    expect(isAdult("invalid-date")).toBe(false);
  });

  it("retourne false pour une chaîne vide", () => {
    expect(isAdult("")).toBe(false);
  });
});

describe("isValidName — cas généraux", () => {
  it("accepte un prénom simple", () => {
    expect(isValidName("Jean")).toBe(true);
  });

  it("accepte un prénom avec accent (é)", () => {
    expect(isValidName("Élodie")).toBe(true);
  });

  it("accepte un prénom avec cédille (François)", () => {
    expect(isValidName("François")).toBe(true);
  });

  it("accepte un prénom avec tréma (Müller)", () => {
    expect(isValidName("Müller")).toBe(true);
  });

  it("accepte un nom composé avec tiret (Anne-Marie)", () => {
    expect(isValidName("Anne-Marie")).toBe(true);
  });

  it("accepte un nom avec apostrophe (O'Brien)", () => {
    expect(isValidName("O'Brien")).toBe(true);
  });

  it("accepte un nom avec espace (Jean Paul)", () => {
    expect(isValidName("Jean Paul")).toBe(true);
  });

  it("accepte exactement 2 caractères (minimum valide)", () => {
    expect(isValidName("Al")).toBe(true);
  });
});

describe("isValidName — cas invalides", () => {
  it("rejette un nom d'un seul caractère", () => {
    expect(isValidName("A")).toBe(false);
  });

  it("rejette un nom avec des chiffres (Jean123)", () => {
    expect(isValidName("Jean123")).toBe(false);
  });

  it("rejette un nom avec caractère spécial (!)", () => {
    expect(isValidName("Jean!")).toBe(false);
  });

  it("rejette un nom avec caractère spécial (@)", () => {
    expect(isValidName("Jean@Dupont")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isValidName("")).toBe(false);
  });

  it("rejette une chaîne d'espaces uniquement", () => {
    expect(isValidName("   ")).toBe(false);
  });

  it("rejette null", () => {
    expect(isValidName(null)).toBe(false);
  });

  it("rejette undefined", () => {
    expect(isValidName(undefined)).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepte un email standard", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("accepte un email avec sous-domaine", () => {
    expect(isValidEmail("user.name@domain.fr")).toBe(true);
  });

  it("accepte un email avec TLD long (co.uk)", () => {
    expect(isValidEmail("john.doe@company.co.uk")).toBe(true);
  });

  it("rejette un email sans @", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("rejette un email avec double @", () => {
    expect(isValidEmail("test@@example.com")).toBe(false);
  });

  it("rejette un email sans domaine après @", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejette un email sans extension (.com manquant)", () => {
    expect(isValidEmail("user@domain")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejette un email avec espaces", () => {
    expect(isValidEmail("   ")).toBe(false);
  });
});

describe("isValidZipcode", () => {
  it("accepte un code postal valide à 5 chiffres", () => {
    expect(isValidZipcode("75001")).toBe(true);
  });

  it("accepte le code postal 00100", () => {
    expect(isValidZipcode("00100")).toBe(true);
  });

  it("rejette un code postal à 4 chiffres", () => {
    expect(isValidZipcode("7500")).toBe(false);
  });

  it("rejette un code postal à 6 chiffres", () => {
    expect(isValidZipcode("750001")).toBe(false);
  });

  it("rejette un code postal avec une lettre (7500A)", () => {
    expect(isValidZipcode("7500A")).toBe(false);
  });

  it("rejette un code postal alphanumérique (75A01)", () => {
    expect(isValidZipcode("75A01")).toBe(false);
  });

  it("rejette un code composé de lettres uniquement", () => {
    expect(isValidZipcode("abcde")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isValidZipcode("")).toBe(false);
  });
});

describe("validateForm", () => {
  it("retourne les messages d'erreur attendus pour des données invalides", () => {
    const errors = validateForm({
      firstName: "A",
      lastName: "1",
      email: "email",
      birthdate: "2010-01-01",
      city: "",
      zipcode: "7500",
    });

    expect(errors).toEqual({
      firstName: "Prénom invalide",
      lastName: "Nom invalide",
      email: "Email invalide",
      birthdate: "Vous devez avoir 18 ans ou plus",
      city: "Ville invalide",
      zipcode: "Code postal invalide",
    });
  });

  it("retourne une erreur de date requise si birthdate est vide", () => {
    const errors = validateForm({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      birthdate: "",
      city: "Paris",
      zipcode: "75001",
    });

    expect(errors).toEqual({
      birthdate: "Date de naissance requise",
    });
  });

  it("retourne un objet vide pour des données totalement valides", () => {
    const today = new Date();
    const adultDate = new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate(),
    );
    const errors = validateForm({
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@example.com",
      birthdate: adultDate.toISOString().split("T")[0],
      city: "Lyon",
      zipcode: "69001",
    });

    expect(errors).toEqual({});
  });

  it("gère les valeurs vides et null correctement", () => {
    expect(isValidName("")).toBe(false);
    expect(isValidEmail("   ")).toBe(false);
    expect(isValidZipcode("")).toBe(false);
    expect(isAdult("")).toBe(false);
    expect(isAdult("not-a-date")).toBe(false);
  });
});
