
describe('Pre-deployment tests', () => {
  it('login and enter home page', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-testid="Login"]').click();
    cy.get('[data-testid="email"]').type('abc@gmail.com');
    cy.get('[data-testid="password"]').type('123456789');
    cy.get('[id="enter-button"]').click();
    cy.on('window:alert', (text) => { expect(text).to.equal('Login successful!') });
  });

   it('navigate to reflection page and enter responses and submit', () => {
    cy.visit('http://localhost:3000/reflection');
    // cy.get('[data-testid="Login"]').click();
    // cy.get('[data-testid="email"]').type('abc@gmail.com');
    // cy.get('[data-testid="password"]').type('123456789');
    // cy.get('[id="enter-button"]').click();
    // cy.on('window:alert', (text) => { expect(text).to.equal('Login successful!') });
  });



})