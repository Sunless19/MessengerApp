describe('Login Test', () => {
    it('should log in successfully with correct credentials', () => {
      cy.fixture('e2etest').then((user) => {
        cy.visit('http://localhost:4200/login');
        
        cy.get('input[name="username"]').type(user.username);
        cy.get('input[name="password"]').type(user.password);
        
        cy.get('button.submit-button').contains('Login').click();
        
        cy.url().should('include', '/profile');
      });
    });
  });
  