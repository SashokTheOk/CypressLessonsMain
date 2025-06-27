describe('Header and Footer Elements', () => {
  before(() => {
    cy.visit('https://qauto.forstudy.space/');
    cy.get('input[formcontrolname=email]').type('guest');
    cy.get('input[formcontrolname=password]').type('welcome2qauto');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/panel/garage');
  });

  it('should find all header buttons', () => {
    // Перевірка наявності всіх кнопок у хедері
    cy.get('app-header').within(() => {
      cy.get('button').should('have.length.at.least', 1);
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('be.visible');
      });
    });
  });

  it('should find all footer links and buttons', () => {
    // Прокручуємо вниз, якщо футер прихований
    cy.scrollTo('bottom');
    cy.get('app-footer').within(() => {
      cy.get('a, button').should('have.length.at.least', 1);
      cy.get('a, button').each(($el) => {
        cy.wrap($el).should('be.visible');
      });
    });
  });
});