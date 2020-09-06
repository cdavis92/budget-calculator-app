// BUDGET CONTROLLER
var budgetController = (function() {


	// function constructors
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	// this calculates the percentage
	Expense.prototype.calcPercentage = function(totalIncome) {

		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}

	};

	// this returns the percentage
	Expense.prototype.getPercentage = function() {

		return this.percentage;

	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});

		data.totals[type] = sum;
	};

	// data structure
	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		},

		budget: 0,
		percentage: -1 // a value to say that something is non existence, as it doesn't exist at this point
	};


	return {

		addItem: function(type, des, val) {

			var newItem, ID;

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// push it into our data structure
			data.allItems[type].push(newItem);

			//return the new element
			return newItem;
		},

		deleteItem: function(type, id) {


			// id 6
			// [1 2 4 6 8]
			// data.allItems[type][id];
			// index = 3

			// .map() returns a brand new array

			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			// returns the index number of the array
			index = ids.indexOf(id);

			// remove something if the index actually exists
			// -1 if it didn't find the element
			if (index !== -1) {
				// splice is used to remove elements
				// index is the number to be found (3), and 1 is the number of elements to be removed.
				data.allItems[type].splice(index, 1);
			}



		},

		calculateBudget: function() {

			// calculate total income payment and payment expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}


		},

		calculatePercentages: function() {

			/*
			a=20
			b=10
			c=40
			income=100
			a=20/100 = 20%
			b=10/100 = 10%
			c=40/100 = 40%
			*/

			data.allItems.exp.forEach(function(cur) {

				// call the calcpercentage method
				cur.calcPercentage(data.totals.inc);

			});

		},

		getPercentages: function() {

			// loop all of the expenses
			// call the getpercentage method on all the objects
			// use the map method to return and store percentages
			var allPerc = data.allItems.exp.map(function(cur) {
				// for each of the 5 elements, return and store it in the allPerc array
				return cur.getPercentage();
			});
			// the array of all the percentages
			return allPerc;

		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		// NEW FEATURE - 'delete all data'. resets all the data in the data structure back to the default settings
		deleteAllData: function() {

			data.allItems.exp = [];
			data.allItems.inc = [];

			data.totals.exp = 0;
			data.totals.inc = 0;

			data.budget = 0;
			data.percentage = 0;

		},

		// console log data inputted from the data structure
		testing: function() {
			console.log(data);
		}
	}



})();


// UI CONTROLLER
var UIController = (function() {

	
	var DOMstrings = {
		darkModeBtn: '.dark-mode__btn',
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		deleteBtn: '.add__delete--btn',
		infoBtn: '.add__info--btn',
		item: '.item',
		add: '.add',
		income: '.income',
		expenses: '.expenses',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'

	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec, type;
		/*
		+ or - before number
		exactly 2 decimal points
		comma seperating the thousands

		2310.4567 -> + 2,310.46 (round ths number)
		2000 -> + 2,000.00
	
		*/

		// abs = absolute. absolute removes the sign of the number
		// overwriting the num arguement
		// e.g. 1234.5678 -> 1234.57
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');
		int = numSplit[0];
		if (int.length > 3) {
			// read from position 0 to position 1
			// plus a comma
			// then read position 1 to 3
			// int.length - 3 is to add comma dynamic (whether its 1,000 or 10,000 etc.)
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
		}

		dec = numSplit[1];

		// if type is equal to expense, show minus, else show plus. Then add the integer variable, then decimal variable;
		// () means it will be executed first
		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

	};

	// reusable code
	// each time of hving a nodelist, use this
	var nodeListForEach = function(list, callback) {
		for (var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};


	return {
		getInput: function() {

			return {		
				type: document.querySelector(DOMstrings.inputType).value, // will be either inc (income) or exp (expense)
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parseFloat converts a string to number
			}
		},

		addListItem: function (obj, type) {
			var html, newHtml, element;

			// Create HTML string with placeholder text
			if (type === 'inc') {
					element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%" tabindex="0"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline" tabindex="1"></i></button> </div> </div> </div>';

			} else if (type == 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%" tabindex="0"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

			}

			// Replace the placeholder text with some actual data

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},


		deleteListItem: function(selectorID) {

			// remove element (saved within a variable).
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},


			// empties description after entering
		clearFields: function() {

			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();

		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {

				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

			} else {

				document.querySelector(DOMstrings.percentageLabel).textContent = '---';

			}

			// the budget
			// the total income
			// the total expense
			// the percentage


		},

		displayPercentages: function(percentages) {

			// returns a list
			// returns a node list (in the DOM tree, where the HTML elements on the page asre stored, each element is called a node. thats also the property used before was called parentNode.)
			// need to loop all of these elements, and change the text property.
			// node list does not have forEach
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, function(current, index) {

				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});

		},


		displayMonth: function() {
			var now, month, year;

			now = new Date();

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            document.querySelector(DOMstrings.deleteBtn).classList.toggle('red');
            document.querySelector(DOMstrings.infoBtn).classList.toggle('red');
            document.querySelector(DOMstrings.modalCloseBtn).classList.toggle('red');

        },

        // NEW FEATURE - 'Dark Mode'. toggles classes to turn dark mode on and off
        darkModeOn: function() {

        	var body, fields, darkModeBtnToggle, modalWindowOpen;

        	fields = document.querySelectorAll(
        		DOMstrings.income + ',' +
        		DOMstrings.expenses + ',' +
        		DOMstrings.add);

        	nodeListForEach(fields, function(cur) {
        		cur.classList.toggle('dark-mode-type__on');
        	});

        	darkModeBtnToggle = document.querySelector(DOMstrings.darkModeBtn).classList.toggle('dark-mode-toggle__on');

        	body = document.getElementsByTagName("body")[0].classList.toggle('dark-mode__on');

        },

		getDOMstrings: function() {
			return DOMstrings;
		}
	}

})();


// pass arguements into them
// pass outer 2 modules as arguements and can connect them
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {


	var setUpEventListeners = function() {

		// get access to the DOMstrings object from the other module
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.querySelector(DOM.deleteBtn).addEventListener('click', deleteAllItems);

		document.querySelector(DOM.darkModeBtn).addEventListener('click', darkMode);

		// press any key for an event, shows keycode in the prototype. Older browsers use which
		document.addEventListener('keypress', function(event) {

			if(event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}

		});

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

		// event listener to te container, runs function
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function() {

		// 1 - calculate the budget
		budgetCtrl.calculateBudget();

		// 2 - return the budget
		var budget = budgetCtrl.getBudget();

		// 3 - display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {

		//1. Calculate percentages
		budgetCtrl.calculatePercentages();

		//2. Read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();

		//3. Update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function() {
		var input, newItem;

	// 1 - get the field input data
	input = UICtrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

			// 2 - add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3 - add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4 - Clear the fields
			UICtrl.clearFields();

			// 5 - display thr budget on the UI
			updateBudget();

			// 6 - calculate and update percentages
			updatePercentages();

		}

	};

	// from the event listener, listens to the element of where it was from
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		// move further up the DOM, store the ID in the variable.
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {

			// inc1
			// splits the data between the dashes.
			splitID = itemID.split('-');
			type = splitID[0];
			// parseInt converts a string into an interger
			ID = parseInt(splitID[1]);

			// 1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			// 2. delete item from ui
			UICtrl.deleteListItem(itemID);

			//3. update and show new budget
			updateBudget();

			// 4 - calculate and update percentages
			updatePercentages();

		}
	}

	// NEW FEATURE - 'Delete All Items'. This will clear and delete the whole budget calculator
	var deleteAllItems = function() {

		var el, idArr, DOM;

		DOM = UICtrl.getDOMstrings();

			// selects all elements with the class .item (from DOM Strings)
			el = document.querySelectorAll(DOM.item);

			// removes the elements from the DOM that were collected from the query selector and with removeChild
			Array.prototype.forEach.call(el, function(node) {
			    node.parentNode.removeChild(node);
			});

			// calls the deleteAllData function in budget controller
			budgetCtrl.deleteAllData();

			// resets the App
			controller.init();

	}

	// NEW FEATURE - 'Dark Mode'. Change between Light and Dark Mode with the button + toggle + event listener.
	var darkMode = function() {

		UICtrl.darkModeOn();

	}

	return {
		init: function() {
			console.log('application has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			
			setUpEventListeners();
		}
	}


})(budgetController, UIController);

controller.init();