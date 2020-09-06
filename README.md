# budget-calculator-app
Budget Calculator Application - coded using HTML5, CSS3 and JavaScript. A web application to calculate and manage income and expenses.


# How to use application / General Information

To use this application, users can enter an 'income' amount (set as default), which is then added to the income part of the calculator (with a small text description of what the income was). Adding more income will be calculated and be added to the total amount displayed at the top of the page.

However, if the user wants to enter an expense, click on the dropdown menu to show the minus '-' symbol, enter the text description of the expense, and then the expense amount, which is then calculated and displays the updated total amount at the top of the page. 

This will show the expense amount underneath the income amount, and also display the percentage of how much has been expensed from the total amount. The total amount is then calculated and updated.

This application also displays a dynamic month and year based on the internet clock/time using new Date(), getMonth() and getFullYear().

Within the JavaScript, these use 3 private functions: Budget Controller function, UI Controller function and Global App Controller function. Dummy data is shown in the HTML, but replaced to 0/empty values when application has started. A console log message displays to show that the application has successfully started.

Data that is entered from the front end is then stored into a Data object with an Income array and an Expense Array. If a user wishes to delete a particular income or expense from the main front end, a cross 'X' icon will appear next to that income or expense. Clicking this icon will remove it from the main calculator and the array will reorder the income and expenses.

Dark Mode is also included as part of this application, with colours inverting on the main application.

Validation is also part of this application, and users can not enter empty values in the application, enter text description but no value, or value but no text description. You can not enter minus numbers on income or expense.

Finally, users can clear/reset the calculator again by clicking the cross 'X' button next to the tick icon.
