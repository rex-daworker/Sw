/**
 * @jest-environment jsdom
 */
const { addTask, deleteTask, taskList } = require('../script');

beforeEach(() => {
    document.body.innerHTML = '<input id="taskInput" value=""><ul id="taskList"></ul>';
    taskList.length = 0;
    // HTML gets reset and it clears the tasklist

    taskList.push({ text: 'First', completed: false });
    taskList.push({ text: 'Second', completed: false });
    taskList.push({ text: 'Third', completed: false });
});
// Three tasks are added for testing

test('deletes a task from the middle', () => {
    deleteTask(1); // Delete 'Second'
    expect(taskList.length).toBe(2);
    expect(taskList[0].text).toBe('First');
    expect(taskList[1].text).toBe('Third'); 
    // Other tasks remain but checks that 'Second' is removed
});

test('deletes the last task without crashing', () => {
    deleteTask(2); // Delete 'Third'
    expect(taskList.length).toBe(2);
    //Checks that the last task get deleted
});

test('deletes the first task', () => {
    deleteTask(0); // Delete 'First'
    expect(taskList.length).toBe(2);
    expect(taskList[0].text).toBe('Second'); // 'Second' is now first, because it checks that 'First' task is deleted
});