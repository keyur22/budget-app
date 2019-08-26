// Data Module
var BudgetController = (function () {

    // Income
    var Income = function (id, amount, desc, type) {
        this.id = id;
        this.amount = amount;
        this.description = desc;
        this.type = type;
    };

    // Expense
    var Expense = function (id, amount, desc, type) {
        this.id = id;
        this.amount = amount;
        this.description = desc;
        this.type = type;
    };

    // Calculate Expense Percentage
    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc === 0) {
            this.percentage = 0;
        } else {
            this.percentage = Math.round((this.amount / totalInc) * 100);
        }
    }

    // Data Structure
    var data = {
        'all': {
            'inc': [],
            'exp': []
        },
        'totals': {
            'inc': 0,
            'exp': 0
        }
    }

    return {
        addItem: function (type, amount, desc) {
            var id, item, total;

            if (data.all[type].length === 0) {
                // First entry
                id = 0;
            } else {
                // Fetch id of last obj and increment by 1
                id = data.all[type][data.all[type].length - 1].id + 1;
            }

            // Call Constructor function according to type
            if (type === 'inc') {
                item = new Income(id, amount, desc, type);
            } else if (type === 'exp') {
                item = new Expense(id, amount, desc, type);
            }

            data.all[type].push(item); // Push entry in array
            return item;
        },
        removeItem: function (id, type) {
            // Return All Expenses after removing current one
            data.all[type] = data.all[type].filter(function (obj) {
                return obj.id !== id;
            });
        },
        calculateBudget: function (type) {
            var amt = 0;
            data.all[type].forEach(curr => {
                amt += curr.amount;
            });
            data.totals[type] = amt;
            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc === 0) {
                data.percent = 0;
            } else {
                data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },
        calculateExpensePercentages: function () {
            data.all.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
            })
        },
        getBudget: function () {
            return {
                'budget': data.budget,
                'totalInc': data.totals.inc,
                'totalExp': data.totals.exp,
                'percent': data.percent
            }
        },
        getExpensePercentages: function () {
            var expObj = data.all.exp.map(function (curr, value) {
                return {
                    id: curr.id,
                    percent: curr.percentage
                }
            })
            return expObj;
        },
    }

})();

// UI Module
var UIController = (function () {
    var DOMStrings = {
        'form': document.querySelector('#addEntry'),
        'type': document.querySelector('#addEntry #type'),
        'amount': document.querySelector('#addEntry #amount'),
        'description': document.querySelector('#addEntry #description'),
        'incomeContainer': document.querySelector('.entries #inc-container'),
        'expensesContainer': document.querySelector('.entries #exp-container'),
        'emptyIncomeMsg': document.querySelector('.entries #inc-empty'),
        'emptyExpMsg': document.querySelector('.entries #exp-empty'),
        'totalBudget': document.querySelector('.budget-section .total-budget'),
        'totalIncome': document.querySelector('.budget-section .total-inc'),
        'totalExpense': document.querySelector('.budget-section .total-exp'),
        'totalExpensePercent': document.querySelector('.budget-section .percent'),
        'entriesContainer': document.querySelector('.container .entries'),
        'currentMonth': document.querySelector('.budget-section .current-month')
    }

    // Indian Rupee Price Format
    var priceFormat = {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    }

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        getInput: function () {
            return {
                'type': DOMStrings.type.value,
                'amount': parseFloat(DOMStrings.amount.value),
                'description': DOMStrings.description.value
            }
        },
        displayItem: function (item) {
            var html, element;

            if (item.type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<li class="list-group-item list-group-item-success d-flex flex-wrap justify-content-between align-items-center" id="inc-%id%"><p class="description mb-0">%description%</p><span class="amount text-left text-lg-center">+ %amount%</span><span class="remove text-left">&times;</span></li>';
            } else if (item.type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<li class="list-group-item list-group-item-danger d-flex flex-wrap justify-content-between align-items-center" id="exp-%id%"><p class="description mb-0">%description%</p><span class="amount text-left text-lg-center">- %amount%</span><span class="badge bg-light text-danger mx-2">17%</span><span class="remove text-right">&times;</span></li>';
            }

            html = html.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%amount%', item.amount.toLocaleString('en-IN', priceFormat));
            element.insertAdjacentHTML('afterbegin', html);
        },
        deleteItem: function (id, type) {
            var child, parent, index, list;

            child = document.getElementById(id);
            parent = child.parentNode;
            index = Array.prototype.indexOf.call(parent.children, child);
            if (type === 'inc') {
                list = DOMStrings.incomeContainer;
            } else if (type === 'exp') {
                list = DOMStrings.expensesContainer;
            }
            list.removeChild(list.childNodes[index]);
        },
        clearFields: function () {
            DOMStrings.form.reset();
        },
        displayBudget: function (budget) {
            DOMStrings.totalBudget.textContent = budget.budget.toLocaleString('en-IN', priceFormat);
            DOMStrings.totalIncome.textContent = budget.totalInc.toLocaleString('en-IN', priceFormat);
            DOMStrings.totalExpense.textContent = budget.totalExp.toLocaleString('en-IN', priceFormat);
            var percent = budget.percent === 0 ? '---' : budget.percent + '%';
            DOMStrings.totalExpensePercent.textContent = percent;
        },
        displayExpPercentages: function (obj) {
            obj.forEach(function (curr) {
                var expPercent = curr.percent === 0 ? '---' : curr.percent + '%';
                document.querySelector('#exp-' + curr.id + ' .badge').textContent = expPercent;
            })
        },
        hideEmptyItemMessages: function (type) {
            var elem = '';
            if (type === 'inc') {
                elem = DOMStrings.emptyIncomeMsg;
            } else if (type === 'exp') {
                elem = DOMStrings.emptyExpMsg;
            }
            if (elem.style.display !== 'none') {
                elem.style.display = 'none';
            }
        },
        showEmptyItemMessages: function (type, isInit) {
            var elem, container;
            if (type === 'inc') {
                elem = DOMStrings.emptyIncomeMsg;
                container = DOMStrings.incomeContainer
            } else if (type === 'exp') {
                elem = DOMStrings.emptyExpMsg;
                container = DOMStrings.expensesContainer;
            }

            // Forcefully Initialised
            if (isInit) {
                if (elem.style.display !== 'block') {
                    elem.style.display = 'block';
                }
            } else {
                // Check if no child elements exist in UL
                if (container.childNodes.length === 0) {
                    if (elem.style.display !== 'block') {
                        elem.style.display = 'block';
                    }
                }
            }
        },
        clearEntries: function () {
            DOMStrings.incomeContainer.innerHTML = '';
            DOMStrings.expensesContainer.innerHTML = '';
        },
        DisplayMonth: function () {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
            var date = new Date();
            var month = months[date.getMonth()];
            DOMStrings.currentMonth.textContent = month + ' ' + date.getFullYear();
        }
    }
})();

// Controller Module
var Controller = (function (budgetCtrl, UICtrl) {

    // Update Budget after adding / removing item
    var updateBudget = function () {
        // Calculate Budget
        budgetCtrl.calculateBudget('inc');
        budgetCtrl.calculateBudget('exp');

        // Get Budget
        var budget = budgetCtrl.getBudget();

        // Add Budget to UI
        UICtrl.displayBudget(budget);
    }

    // Calculate Percentages
    var updatePercentages = function () {

        if (budgetCtrl.getBudget().totalExp > 0) {
            // Calculate Percentages
            budgetCtrl.calculateExpensePercentages();

            // Get Percentages
            var expObj = budgetCtrl.getExpensePercentages();

            // Display Percentages
            UICtrl.displayExpPercentages(expObj);
        }
    }

    // Add Input Field Item
    var addItem = function () {
        // Get Input Data
        var input = UICtrl.getInput();

        // Add Input data to DS
        var item = budgetCtrl.addItem(input.type, input.amount, input.description);

        // Hide Empty Item Messages
        UICtrl.hideEmptyItemMessages(input.type);

        // Add Input data to UI
        UICtrl.displayItem(item);

        // Clear Input Fields
        UICtrl.clearFields();

        // Update Budget
        updateBudget();

        // Update Percentages
        updatePercentages();
    }

    // Remove Input field Item  
    var deleteItem = function (itemID) {
        // remove item from DB
        var str = itemID.split('-');
        var id = parseInt(str[1]);
        var type = str[0];

        budgetCtrl.removeItem(id, type);

        // remove item from UI
        UICtrl.deleteItem(itemID, type);

        // Show Item Empty Message if applicable
        UICtrl.showEmptyItemMessages(type, 0);

        // Update Budget
        updateBudget();

        // Update Percentages
        updatePercentages();
    }

    // Setup Event Listeners
    var setupEventListeners = function () {
        // Get DOMStrings
        var DOM = UICtrl.getDOMStrings();
        var form = DOM.form;

        // Form Submit
        form.addEventListener('submit', function (e) {
            // If valid form
            e.preventDefault();
            addItem(); // Add Input Field Item
        });

        // Removing Input Field
        DOM.entriesContainer.addEventListener('click', function (e) {
            deleteItem(e.target.parentNode.getAttribute('id'), DOM);
        })
    }

    return {
        init: function () {
            console.log('Application has Started');
            setupEventListeners();
            UICtrl.displayBudget({
                'budget': 0,
                'totalInc': 0,
                'totalExp': 0,
                'percent': 0
            });
            UICtrl.showEmptyItemMessages('inc', 1);
            UICtrl.showEmptyItemMessages('exp', 1);
            UICtrl.clearEntries();
            UICtrl.DisplayMonth();
        }
    }
})(BudgetController, UIController);

// Initialize the application
Controller.init();