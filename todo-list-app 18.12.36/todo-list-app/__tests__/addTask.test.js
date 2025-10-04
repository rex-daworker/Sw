/**
 * @jest-environment jsdom
 */
const { addTask } = require('../script');
// The addTask function is added from script.js

test('should add a task to the list', () => {

  // A test case is defined
  document.body.innerHTML = `
    <ul id="taskList"></ul>
    <input id="taskInput" value="Test Task">
  `;
//Here the HTML is set up for the test

  addTask();
// addTask function is called 

  const items = document.querySelectorAll('#taskList li');
//All list items in the task list are selected

  expect(items.length).toBe(1);
  //Assertion checks 

  expect(items[0].textContent).toContain('Test Task');
  //Assertion checks
});
