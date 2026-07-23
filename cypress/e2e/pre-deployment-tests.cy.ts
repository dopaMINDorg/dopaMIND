import  "../support/commands.js";


describe('Pre-deployment tests', () => {
  it('login and enter home page', () => {
    cy.login();
  });


describe('Reflection', () => {

   it('navigate to reflection page and enter responses and submit', () => {
    const expectedAlerts = ['Login successful!', 'Saved!'];
    let alertIndex = 0;
    cy.on('window:alert', (text) => {
      expect(text).to.equal(expectedAlerts[alertIndex]);
      alertIndex++;
    });
    cy.login();
    cy.get('[title="Reflection"]').click();

    cy.contains('Loading questions...')
      .should('not.exist');

    cy.get('textarea')
      .should('have.length', 2);

    cy.wait(1000);
    cy.get('textarea').eq(0).click();

    cy.get('textarea')
      .eq(0)
      .type('Today I felt productive and accomplished a lot.', { delay: 100 });

    cy.get('textarea').eq(1).click();

    cy.get('textarea')
      .eq(1)
      .type('I am proud of my accomplishments', { delay: 100 });

    cy.contains('button', 'Submit').click();
});

it('loads prompts when Change Prompts is clicked', () => {
  cy.login();
  cy.get('[title="Reflection"]').click();
  cy.contains('Loading questions...').should('not.exist');
  cy.get('textarea').should('have.length', 2);
  cy.contains('button', 'Change Prompts').click();
  cy.contains('Loading questions...').should('not.exist');
  cy.get('textarea').should('have.length', 2);
});

it('submit prompts and view them in history page', () => {
    const expectedAlerts = ['Login successful!', 'Saved!'];
    let alertIndex = 0;
    cy.on('window:alert', (text) => {
      expect(text).to.equal(expectedAlerts[alertIndex]);
      alertIndex++;
    });
    cy.login();
    cy.get('[title="Reflection"]').click();

    cy.contains('Loading questions...')
      .should('not.exist');

    cy.get('textarea')
      .should('have.length', 2);

    cy.wait(1000);
    cy.get('textarea').eq(0).click();

    cy.get('textarea')
      .eq(0)
      .type('test response 1', { delay: 100 });

    cy.get('textarea').eq(1).click();

    cy.get('textarea')
      .eq(1)
      .type('test response 2', { delay: 100 });
    cy.contains('button', 'Submit').click();
    cy.contains('button', 'View Past Reflections').click();
    cy.contains('Loading...').should('not.exist');
    cy.contains('test response 1').should('be.visible');
    cy.contains('test response 2').should('be.visible');
  });
});

describe("Preferences", () => {

it('navigate to preference page and create a preference', () => {
  cy.login();
  cy.get('[title="Set Preferences"]').click();
  cy.contains("button", "CREATE").click();
  cy.get('#Activity').type('Reading Wizard');
  cy.get('#time-hours').type('2');
  cy.get('#time-minutes').type('30');
  cy.contains('button', 'Add Activity').click();
  cy.contains('Reading Wizard').should("be.visible");
});

it('navigate to preference page and create and delete preference', () => {
  cy.login();
  cy.get('[title="Set Preferences"]').click();
  cy.contains("button", "CREATE").click();
  cy.get('#Activity').type('sweep');
  cy.get('#time-hours').type('2');
  cy.get('#time-minutes').type('30');
  cy.contains('button', 'Add Activity').click();
  cy.contains('sweep').should("be.visible");
  cy.contains('sweep')
    .parent()
    .contains('button', 'delete')
    .click();
  cy.contains('sweep')
    .should('not.exist');
});

it('navigate to preference page and update preference', () => {
  cy.login();
  cy.get('[title="Set Preferences"]').click();
  cy.contains("button", "CREATE").click();
  cy.get('#Activity').type('swoop');
  cy.get('#time-hours').type('2');
  cy.get('#time-minutes').type('30');
  cy.contains('button', 'Add Activity').click();
  cy.contains('swoop').should("be.visible");
  cy.contains('swoop')
    .parent()
    .contains('button', 'edit')
    .click();
  cy.wait(1000);
  cy.get('#Activity').clear().type('swoop two');
  cy.get('#time-hours').clear().type('3');
  cy.get('#time-minutes').clear().type('34');
  cy.contains('button', 'Update Activity').click();
  cy.contains('swoop two').should("be.visible");
});

it('AI generates new preferences', () => {
  cy.login();
  cy.get('[title="Set Preferences"]').click();
  cy.get('.preferences-grid > *')
    .its('length')
    .then((beforeCount) => {

      cy.contains('button', 'Need Help?').click();
      cy.get('input[placeholder="Example: indoor relaxing activities"]').type('I want to improve my productivity');
      cy.contains('button', 'Generate')
        .click();
      cy.get('.preferences-grid > *', { timeout: 20000 })
        .should('have.length', beforeCount + 3);
    });
});

it('updates notification time preference', () => {
  const expectedAlerts = ['Login successful!', 'Notification time updated to 8:30 AM'];
    let alertIndex = 0;
    cy.on('window:alert', (text) => {
      expect(text).to.equal(expectedAlerts[alertIndex]);
      alertIndex++;
    });
  cy.login();
  cy.get('[title="Set Preferences"]').click();
  cy.get('[data-testid="notification-time-input"]')
    .clear()
    .type('08:30');
  cy.contains('button', 'Set your time pref').click();
  cy.contains('Current notification time: 8:30 AM').should('be.visible');
});
});

describe("Weekly Calendar", () => {
it('Opens weekly spread page', () => {
  cy.login();
  cy.get('[title="Weekly Spread"]').click();
  cy.url().should('include', '/weekly');
  cy.get('.rbc-calendar').should('exist');
});
});



});



