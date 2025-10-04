/**
 * @jest-environment jsdom
 */
const script = require('../script');
const { archiveCompleted, taskList, historyList } = script;
// This imports the archiveCompleted, historyList, and taskList from file script.js

beforeEach(() => {
    document.body.innerHTML = '<ul id="taskList"></ul><ul id="archiveList"></ul>';
    taskList.length = 0;
    historyList.length = 0;
    // Setup: there are two tasks, one is complete the other task is not

    taskList.push({ text: 'Done Task', completed: true });
    taskList.push({ text: 'Not Done Task', completed: false });
    // It adds one incomplete task and one completed one for testing
});

test('moves completed tasks to historyList archive', () => {
    archiveCompleted();
    expect(historyList.length).toBe(1);
    expect(historyList[0].text).toBe('Done Task');
    // This checks that the completed task is properly move to archive
});

test('removes completed tasks from the main taskList', () => {
    archiveCompleted();
    expect(taskList.length).toBe(1);
    expect(taskList[0].text).toBe('Not Done Task'); 
    // This keeps only the incomplete task in the main list
});

test('does nothing if there are no completed tasks', () => {
    taskList.length = 0; // All existing tasks are removed
    taskList.push({ text: 'All Incomplete', completed: false }); // Adds or sets up only incomplete task

    archiveCompleted();

    expect(historyList.length).toBe(0); // The archive should still remain empty
    expect(taskList.length).toBe(1); // Task list unchanged
});