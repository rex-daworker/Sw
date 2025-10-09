from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Step:1️ Setup Chrome WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Step: 2️Open your To-Do app (adjusted for your folder path)
driver.get("file:///Users/rexoghenerobo/Desktop/Sw/todo-list-app-3/index.html")

try:
    # Step:3️ Find the input field and "Add Task" button
    input_field = driver.find_element(By.ID, "taskInput")
    add_button = driver.find_element(By.XPATH, "//button[text()='Add Task']")

    # Step:4️ Type in a new task
    input_field.send_keys("Buy groceries")
    add_button.click()

    # Step:5️ Wait for the new task to appear in the list
    wait = WebDriverWait(driver, 5)
    new_task = wait.until(
        EC.presence_of_element_located((By.XPATH, "//ul[@id='taskList']/li[1]/span"))
    )

    # Step:6️ Assert that the new task was added successfully
    assert "Buy groceries" in new_task.text
    print("✅ Test Passed: Task successfully added!")

    # Step:7️ Take a screenshot as evidence
    driver.save_screenshot("selenium_test_passed.png")

except Exception as e:
    print("❌ Test Failed:", e)
    driver.save_screenshot("selenium_test_failed.png")

finally:
    # Give 2 seconds to view the result before closing
    time.sleep(2)
    driver.quit()
