describe('Full User Flow Test', () => {
    it('should log in and navigate through the entire site', () => {
      cy.fixture('e2etest').then((user) => {
        cy.visit('http://localhost:4200/login');
  
        cy.get('input[name="username"]').type(user.username);
        cy.get('input[name="password"]').type(user.password);
        cy.get('button.submit-button').contains('Login').click();
  
        cy.url().should('include', '/profile');
  
        cy.get('h2').should('contain', 'My conversations');
        
        cy.get('button.action-button').contains('Create conversation').click();
        
        cy.url().should('include', '/create');
  
        cy.get('input[name="name"]').type('Title');

        cy.get('textarea[name="tags"]').type('tag1, tag2, tag3');

        cy.get('form').submit(); 

        cy.get('.submit-button').contains('Create conversation').click();

        cy.url().should('include', '/mess');
      });
    });
  });
  