// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// Data Module
var BudgetController = (function () {

    var Income = function (id, amount, desc, type) {
        this.id = id;
        this.amount = amount;
        this.description = desc;
        this.type = type;
    };

    var Expense = function (id, amount, desc, type) {
        this.id = id;
        this.amount = amount;
        this.description = desc;
        this.type = type;
    };

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
        'getAllData': function () {
            return data;
        },
        'addItem': function (type, amount, desc) {
            var id, item, total;

            if (data.all[type].length === 0) {
                id = 1; // First entry
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

            // Calculate totals
            data.totals[type] += amount;
            return item;
        },
        removeItem: function (id, type) {
            data.all[type] = data.all[type].filter(function (obj) {
                return obj.id !== id;
            });
        }
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
    }

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        getInput: function () {
            return {
                'type': DOMStrings.type.value,
                'amount': parseInt(DOMStrings.amount.value),
                'description': DOMStrings.description.value
            }
        },
        displayItem: function (item) {
            var html, element;

            if (item.type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<li class="list-group-item list-group-item-success d-flex flex-wrap justify-content-between align-items-center" id="inc-%id%"><p class="description mb-0">%description%</p><span class="amount text-center">+ %amount%</span><span class="remove text-center">&times;</span></li>';
            } else if (item.type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<li class="list-group-item list-group-item-danger d-flex flex-wrap justify-content-between align-items-center" id="exp-%id%"><p class="description mb-0">%description%</p><span class="amount text-center">- %amount%</span><span class="badge bg-light text-danger mx-2">17%</span><span class="remove text-center">&times;</span></li>';
            }

            html = html.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%amount%', item.amount);
            element.insertAdjacentHTML('afterbegin', html);
        },
        clearFields: function () {
            // DOMStrings.form.classList.remove('was-validated');
            // DOMStrings.amount.value = '';
            // DOMStrings.description.value = '';
        }
    }
})();


// Controller Module
var Controller = (function (budgetCtrl, UICtrl) {

    // Add Input Field Item
    var addItem = function () {
        // Get Input Data
        var input = UICtrl.getInput();

        // Add Input data to DS
        var item = budgetCtrl.addItem(input.type, input.amount, input.description);

        // Add Input data to UI
        UICtrl.displayItem(item);

        // Clear Input Fields
        // UICtrl.clearFields();

        // Calculate Budget

        // Add Budget to UI
    }








    // Setup Event Listeners
    var setupEventListeners = function () {
        // Get DOMStrings
        var DOM = UICtrl.getDOMStrings();
        var form = DOM.form;

        form.addEventListener('submit', function (e) {
            // If valid form
            if (form.checkValidity()) {
                e.preventDefault();
                addItem(); // Add Input Field Item
                form.reset();
            }
        });
    }

    return {
        init: function () {
            console.log('Application has Started');
            setupEventListeners();
        }
    }
})(BudgetController, UIController);

// Initialize the application
Controller.init();