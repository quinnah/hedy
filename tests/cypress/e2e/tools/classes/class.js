import { goToTeachersPage } from "../navigation/nav";

export function createClass()
{
    const classname = `test class ${Math.random()}`;

    goToTeachersPage();
    cy.wait(500);

    cy.get('#create_class_button').click();
    cy.get('#modal-prompt-input').type(classname);
    cy.get('#modal-ok-button').click();

    goToTeachersPage();
    cy.wait(500);

    return classname;
}

/**
 * Make sure that at least one class exists
 *
 * Create a class if one doesn't exist already.
 *
 * Use as follows:
 *
 *      const className = await ensureClass();
 *
 * In an `async` function.
 */
export function ensureClass()
{
    let classname = `test class ${Math.random()}`;
    goToTeachersPage();

    cy.getBySel('view_class_link').then(viewClassLink => {
        if (viewClassLink.length === 0) {
            createClass();
        } else {
            classname = viewClassLink.text();
        }
    });

    return classname
}

export function addStudents(classname, count) {
    const students = Array.from({length:count}, (_, index) => `student_${index}_${Math.random()}`)

    goToTeachersPage();
    cy.wait(500);

    cy.get(".view_class").contains(new RegExp(`^${classname}$`)).click();
    cy.wait(500);

    cy.get('body').then($b => $b.find("#survey")).then($s => $s.length && $s.hide())
    cy.get('#add-student').click();
    cy.get('#create-accounts').click();
    cy.wrap(students).each((student, index) => {
      cy.get(`:nth-child(${(index + 2)}) > #username`).type(student);
      cy.get(`:nth-child(${(index + 2)}) > #password`).type('123456');
    })
    cy.get('#create_accounts_button').click();
    cy.get('#modal-yes-button').click();

    return students;
}

export function addCustomizations(classname){
    goToTeachersPage();

    cy.get(".view_class").contains(classname).click();
    cy.get('#customize-class-button').click();
    cy.get('#enable_level_7').parent('.switch').click();
    cy.getBySel("save_customizations").click();
    cy.get("#back_to_class").click();
}

export function createClassAndAddStudents(){
    const classname = createClass();
    const students = addStudents(classname, 4);
    return {classname, students};
}

export function navigateToClass(classname) {
    goToTeachersPage();
    cy.wait(500);
    cy.get(".view_class").contains(new RegExp(`^${classname}$`)).click();
    cy.wait(500);
    cy.get('body').then($b => $b.find("#survey")).then($s => $s.length && $s.hide())
}

export default {createClassAndAddStudents};