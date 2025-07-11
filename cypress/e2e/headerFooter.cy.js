describe('Header and Footer Elements', () => {
    before(() => {
        cy.visit('https://qauto.forstudy.space/', {
            auth: {
                username: 'guest',
                password: 'welcome2qauto',
            },
        });
    });

    it('should find all header buttons', () => {
        cy.get('app-header').within(() => {
            cy.get('button').should('have.length.at.least', 1);
            cy.get('button').each(($btn) => {
                cy.wrap($btn).should('be.visible');
            });
        });
    });

    it('should find all footer links and buttons', () => {
        cy.get('#contactsSection')

            .scrollIntoView()

            .as('contactsSection');

        cy.get('@contactsSection').within(() => {

            cy.get('a, button').should('have.length.at.least', 1);

            cy.get('a, button').each(($el) => {

                cy.wrap($el).should('be.visible');

            });
        });
    });
});