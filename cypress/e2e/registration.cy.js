// import './commands.js';
describe('Registration form – full validation flow', () => {
  /* ------------------------------------------------------------------ */
  /*  SET‑UP                                                            */
  /* ------------------------------------------------------------------ */
  beforeEach(() => {
    cy.visit('https://qauto.forstudy.space/', {
      auth: { username: 'guest', password: 'welcome2qauto' },
    });

    // відкриваємо форму реєстрації
    cy.get('.hero-descriptor_btn.btn.btn-primary').click();
    cy.contains('Register').should('be.visible');

    // alias‑и полів
    cy.get('[data-cy="firstName"], input[name="name"]').as('firstName');
    cy.get('[data-cy="lastName"],  input[name="lastName"]').as('lastName');
    cy.get('[data-cy="email"],     input[name="email"]').as('email');
    cy.get('[data-cy="password"],  input[name="password"]').as('password');
    cy.get('[data-cy="repeatPassword"], input[name="repeatPassword"]').as('confirmPassword');
    cy.get('[data-cy="submit"], button[type="button"]').as('submit');
  });

  /* ------------------------------------------------------------------ */
  /*  BASIC STATE                                                       */
  /* ------------------------------------------------------------------ */
  it('кнопка "Register" неактивна при порожній формі', () => {
    cy.get('@submit').should('be.disabled');
  });

  /* ------------------------------------------------------------------ */
  /*  FIRST NAME                                                        */
  /* ------------------------------------------------------------------ */
  context('Валідація поля «Name»', () => {
    it('порожнє поле ⇒ "Name is required"', () => {
      cy.get('@firstName').clear();
      cy.get('@submit').click();

      cy.contains('Name is required').should('be.visible');
      cy.get('@firstName')
        .should('have.css', 'border-color')
        .and('match', /rgb\(255,\s*0,\s*0\)/); // червона рамка
    });

    it('не‑Latin символи ⇒ "Name is invalid"', () => {
      cy.get('@firstName').type('Джон_123');
      cy.get('@submit').click();
      cy.contains('Name is invalid').should('be.visible');
    });

    ['A', 'A'.repeat(21)].forEach(val => {
      it(`довжина ${val.length} симв. ⇒ "Name has to be from 2 to 20..."`, () => {
        cy.get('@firstName').clear().type(val);
        cy.get('@submit').click();
        cy.contains('Name has to be from 2 to 20 characters long')
          .should('be.visible');
      });
    });

    it('trim: "   John   " ⇒ валідне «John»', () => {
      cy.get('@firstName').clear().type('   John   ');
      cy.get('@submit').click();

      cy.contains('Name is required').should('not.exist');
      cy.get('@firstName').should('have.value', 'John');
    });
  });

  /* ------------------------------------------------------------------ */
  /*  LAST NAME                                                         */
  /* ------------------------------------------------------------------ */
  context('Валідація поля «Last name»', () => {
    it('порожнє поле ⇒ "Last name is required"', () => {
      cy.get('@lastName').clear();
      cy.get('@submit').click();
      cy.contains('Last name is required').should('be.visible');
    });

    it('некоректні символи ⇒ "Last name is invalid"', () => {
      cy.get('@lastName').type('Доу@');
      cy.get('@submit').click();
      cy.contains('Last name is invalid').should('be.visible');
    });

    ['B', 'B'.repeat(25)].forEach(val => {
      it(`довжина ${val.length} симв. ⇒ "Last name has to be from 2..."`, () => {
        cy.get('@lastName').clear().type(val);
        cy.get('@submit').click();
        cy.contains('Last name has to be from 2 to 20 characters long')
          .should('be.visible');
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /*  EMAIL                                                             */
  /* ------------------------------------------------------------------ */
  context('Валідація поля «Email»', () => {
    it('порожнє поле ⇒ "Email required"', () => {
      cy.get('@email').clear();
      cy.get('@submit').click();
      cy.contains('Email required').should('be.visible');
    });

    it('некоректний email ⇒ "Email is incorrect"', () => {
      cy.get('@email').type('john.doe@');
      cy.get('@submit').click();
      cy.contains('Email is incorrect').should('be.visible');
    });
  });

  /* ------------------------------------------------------------------ */
  /*  PASSWORD                                                          */
  /* ------------------------------------------------------------------ */
  context('Валідація поля «Password»', () => {
    it('порожнє ⇒ "Password required"', () => {
      cy.get('@password').clear();
      cy.get('@submit').click();
      cy.contains('Password required').should('be.visible');
    });

    const badPwds = [
      'Short1A',            // <8
      'toolongpassword1A',  // >15
      'password1',          // no capital
      'PASSWORD1',          // no small
      'Password',           // no digit
    ];

    badPwds.forEach(pwd => {
      it(`"${pwd}" ⇒ помилка формату`, () => {
        cy.get('@password').clear().type(pwd);
        cy.get('@submit').click();
        cy.contains(
          'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter'
        ).should('be.visible');
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /*  REPEAT PASSWORD                                                   */
  /* ------------------------------------------------------------------ */
  context('Валідація підтвердження пароля', () => {
    it('порожнє ⇒ "Re-enter password required"', () => {
      cy.get('@confirmPassword').clear();
      cy.get('@submit').click();
      cy.contains('Re-enter password required').should('be.visible');
    });

    it('не збігаються ⇒ "Passwords do not match"', () => {
      cy.get('@password').type('StrongPass1', { sensitive: true });

      cy.get('@confirmPassword').type('StrongPass1', { sensitive: true });

      cy.get('@submit').click();
      cy.contains('Passwords do not match').should('be.visible');
    });
  });

  /* ------------------------------------------------------------------ */
  /*  HAPPY PATH                                                        */
  /* ------------------------------------------------------------------ */
  it('успішна реєстрація відправляє POST /api/auth/register', () => {
    cy.intercept('POST', '/api/auth/register').as('register');

    cy.get('@firstName').type('John');
    cy.get('@lastName').type('Doe');
    cy.get('@email').type(`john.doe+${Date.now()}@example.com`);
    cy.get('@password').type('StrongPass1', { sensitive: true });

    cy.get('@confirmPassword').type('StrongPass1', { sensitive: true });


    cy.get('@submit').should('not.be.disabled').click();

    cy.wait('@register')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);
  });
});


// ЛОГИНИТСЯ ОК
//     it('should log-in with the registered user', () => {
//     cy.get('.btn.btn-outline-white.header_signin').click();
//     cy.login('fedojaj863@fuasha.com', 'A12345678s');
// });