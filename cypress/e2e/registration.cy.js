describe('Registration Form E2E Tests', () => {
  beforeEach(() => {
    // Navigate to the base URL before each test
    cy.visit('/');
  });

  it('Scenario 1: No user registered -> add user -> 1 user registered', () => {
    // 1. Vider le localstorage
    cy.clearLocalStorage();
    cy.reload(); // Reload to ensure state is fresh

    // 2. Aucun utilisateur inscrit
    cy.contains('0 user(s) already registered').should('be.visible');

    // 3. Navigation vers la page de formulaire / Ajout d'un nouvel utilisateur sans erreur
    cy.get('input[name="firstName"]').type('Jean');
    cy.get('input[name="lastName"]').type('Dupont');
    cy.get('input[name="email"]').type('jean.dupont@example.com');
    cy.get('input[name="birthdate"]').type('1990-01-01');
    cy.get('input[name="city"]').type('Paris');
    cy.get('input[name="zipcode"]').type('75000');
    
    // Le bouton doit être activé
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Vérification du message de succès
    cy.contains('Inscription enregistrée avec succès').should('be.visible');

    // 4. Navigation vers la page d'accueil (ou rechargement pour lire le localStorage) / Un utilisateur inscrit
    cy.reload();
    cy.contains('1 user(s) already registered').should('be.visible');
  });

  it('Scenario 2: 1 user registered -> add user with error -> still 1 user registered', () => {
    // 1. Initialiser avec 1 utilisateur inscrit
    cy.window().then((win) => {
      win.localStorage.setItem('registration', JSON.stringify({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        birthdate: '1995-05-05',
        city: 'Lyon',
        zipcode: '69000'
      }));
    });
    cy.reload(); // Reload to reflect local storage

    // Vérifier qu'il y a 1 utilisateur inscrit
    cy.contains('1 user(s) already registered').should('be.visible');

    // 2. Ajout d'un nouvel utilisateur avec erreur (ex: prénom trop court)
    cy.get('input[name="firstName"]').type('A');
    cy.get('input[name="lastName"]').type('B');
    cy.get('input[name="email"]').type('test@example.com'); // Valid email to bypass HTML5 validation
    cy.get('input[name="birthdate"]').type('2010-01-01'); // Mineur
    cy.get('input[name="city"]').type('L'); // Trop court
    cy.get('input[name="zipcode"]').type('123'); // Code postal invalide

    // Soumission du formulaire (même si bouton disabled, on force le submit ou on valide les erreurs visuelles)
    // Actually, the submit button is disabled by 'isFormValid()' logic unless all fields are filled.
    // If it's disabled, we can't click it. But the instructions say "Ajout d'un nouvel utilisateur avec erreur"
    // Wait, 'isFormValid()' only checks if fields are NOT EMPTY.
    // Let's make sure the button is not disabled by filling everything.
    
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Vérification de l'erreur
    cy.contains('Veuillez corriger les erreurs du formulaire').should('be.visible');

    // 3. Toujours 1 utilisateur inscrit
    cy.reload();
    cy.contains('1 user(s) already registered').should('be.visible');
  });
});
