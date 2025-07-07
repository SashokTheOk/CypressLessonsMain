Cypress.Commands.add('login', (username, password) => {
  cy.get('#signinEmail').type('fedojaj863@fuasha.com');
  cy.get('#signinPassword').type('A12345678s');
  cy.contains('Login').click();
});

Cypress.Commands.overwrite(
  'type',
  (originalFn, subject, text, options = {}) => {

    // якщо опцію sensitive явно ввімкнено
    if (options.sensitive) {
      // вимикаємо стандартний лог Cypress,
      // аби у ньому не з’явився пароль у відкритому вигляді
      options.log = false;

      // Створюємо власний запис у логах
      Cypress.log({
        $el: subject,           // елемент, у який вводимо
        name: 'type',           // назва команди в GUI
        message: '*'.repeat(String(text).length), // маска
        consoleProps() {        // що показати в DevTools > Logs
          return {
            Typed: `${String(text).length} masked characters`,
            Sensitive: true,
          };
        },
      });
    }

    // Викликаємо оригінальну команду `cy.type`
    return originalFn(subject, text, options);
  }
);