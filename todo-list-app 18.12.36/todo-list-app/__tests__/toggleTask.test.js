/**
 * @jest-environment jsdom
 */
const { toggleTask, taskList } = require('../script');
//toggleTask function and taskList array they are imported from script.js

beforeEach(() => {
    taskList.length = 0;
    taskList.push({ text: 'Task 1', completed: false });
    taskList.push({ text: 'Task 2', completed: true }); 
    // It adds two tasks for testing and resets taskList before each test
});

test('toggles an incomplete task to complete', () => {
    toggleTask(0);
    expect(taskList[0].completed).toBe(true);
    //Toggling checks completed status to incomplete
});

test('toggles a complete task back to incomplete', () => {
    toggleTask(1);
    expect(taskList[1].completed).toBe(false);
    //This ensures that only selected tasks are toggled
});

test('does not change other tasks when toggling', () => {
    toggleTask(0);
    expect(taskList[1].completed).toBe(true); // Should still be true and not throw an error
});

test('does not crash on invalid index', () => {
    expect(() => { toggleTask(10) }).not.toThrow(); // Should not throw an error
    // This checks the function handles invalid indexes safely
});