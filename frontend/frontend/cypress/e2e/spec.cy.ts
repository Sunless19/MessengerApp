describe('Home Page', () => {
    it('should load the home page', () => {
      cy.visit('http://localhost:4200/login');  
      cy.contains('Login'); 
    });
  });
  