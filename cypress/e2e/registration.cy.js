describe('Registration Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Tests classiques', () => {
    it('Scenario 1: Inscription réussie', () => {
      // On intercepte la requête POST pour simuler la réussite sans toucher à la vraie DB
      cy.intercept('POST', '**/users', {
        statusCode: 200,
        body: { id: 1, message: "User created successfully" }
      }).as('createUser');

      cy.get('input[name="firstName"]').type('Jean');
      cy.get('input[name="lastName"]').type('Dupont');
      cy.get('input[name="email"]').type('jean.dupont@example.com');
      cy.get('input[name="birthdate"]').type('1990-01-01');
      cy.get('input[name="city"]').type('Paris');
      cy.get('input[name="zipcode"]').type('75000');
      
      cy.get('[data-cy="btn-sync"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 200);
      cy.contains('Inscription enregistrée avec succès').should('be.visible');
    });

    it('Scenario 2: Erreur de validation (Prénom trop court)', () => {
      cy.get('input[name="firstName"]').type('A');
      cy.get('input[name="lastName"]').type('B');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="birthdate"]').type('2010-01-01');
      cy.get('input[name="city"]').type('L');
      cy.get('input[name="zipcode"]').type('123');

      cy.get('[data-cy="btn-sync"]').click();

      cy.contains('Veuillez corriger les erreurs du formulaire').should('be.visible');
    });
  });

  describe('Tests en mode Offline', () => {
    it('devrait se comporter correctement', () => {
      if (!Cypress.env('offline')) {
        cy.intercept('POST', '**/users', { statusCode: 200, body: {} }).as('syncRequest');
        
        // Remplir un formulaire valide avant de cliquer sinon le bouton est désactivé
        cy.get('input[name="firstName"]').type('Jean');
        cy.get('input[name="lastName"]').type('Dupont');
        cy.get('input[name="email"]').type('jean.dupont@example.com');
        cy.get('input[name="birthdate"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="zipcode"]').type('75000');

        cy.get('[data-cy="btn-sync"]').click();
        cy.wait('@syncRequest').then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
          cy.contains('Inscription enregistrée avec succès').should('be.visible');
        });
      }
    });

    it('devrait afficher un message d\'erreur quand le réseau est coupé', () => {
      if (Cypress.env('offline')) {
        cy.log('Mode offline activé !');
        // On intercepte pour forcer une erreur 500
        cy.intercept('POST', '**/users', { statusCode: 500 }).as('syncRequest');
        
        cy.get('input[name="firstName"]').type('Jean');
        cy.get('input[name="lastName"]').type('Dupont');
        cy.get('input[name="email"]').type('jean.dupont@example.com');
        cy.get('input[name="birthdate"]').type('1990-01-01');
        cy.get('input[name="city"]').type('Paris');
        cy.get('input[name="zipcode"]').type('75000');

        cy.get('[data-cy="btn-sync"]').click();
        cy.wait('@syncRequest').then((interception) => {
          expect(interception.response.statusCode).to.equal(500);
          cy.contains("Erreur lors de l'enregistrement en base de données").should('be.visible');
        });
      }
    });
  });
});
