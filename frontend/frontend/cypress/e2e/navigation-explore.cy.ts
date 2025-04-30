describe('Full User Flow Test', () => {
    it('should log in and navigate through the entire site', () => {
      cy.fixture('e2etest').then((user) => {
        cy.visit('http://localhost:4200/login');
  
        cy.get('input[name="username"]').type(user.username);
        cy.get('input[name="password"]').type(user.password);
        cy.get('button.submit-button').contains('Login').click();
  
        cy.url().should('include', '/profile');
  
        cy.get('h2').should('contain', 'My conversations');
        
        cy.get('button.action-button').contains('Explore conversations').click();

        cy.url().should('include', '/explore');
    
        cy.get('input.search-input').type('#programming'); 
        cy.get('button#search-button').click(); 
    
        cy.get('.conversation-item').should('have.length.greaterThan', 0); 
    
        cy.get('button#clear-button').contains('❌').click(); 
    
        cy.get('input.search-input').should('have.value', '');  
        
        cy.get('.tag-item').eq(0).click(); 
 
        cy.get('input.search-input').should('have.value', '#programming'); 
        
        cy.get('button.random-button').click();
        
        cy.url().should('include', '/mess'); 

        cy.go('back');

        cy.get('.conversation-item')  
        .contains('Test') 
        .parents('.conversation-item') 
        .find('.join-button')  
        .click();  

        cy.url().should('include', '/mess');

        cy.get('input.input-field').type('Hello World');

        cy.get('button.send-button').click();
    
        cy.get('.messages').within(() => {
          cy.get('.name').last().should('contain', 'e2etest');
          cy.get('.text').last().should('contain', 'Hello World');
        });

        cy.get('.messages').within(() => {
            cy.get('.name').first().should('not.be.empty');
            cy.get('.text').first().should('not.be.empty');
          });   
      });
    });
  });
  