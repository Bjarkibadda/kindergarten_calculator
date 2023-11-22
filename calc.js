// Constants for costs
const hourGeneralCost = 4278;
const breakfastCost = 2908;
const lunchCost = 6925;
const afternoonSnackCost = 2908;

// Hourly costs
const hourCosts = {
  4: 17114,
  5: 21392,
  6: 25671,
  7: 29949,
  8: 34228,
  8.5: 38506,
};

document.addEventListener('DOMContentLoaded', function() {
  const singleBtn = document.getElementById('single');
  const coupleBtn = document.getElementById('couple');
  let isSingle = true; // default to 'single'

  const childrenCountSelect = document.getElementById('childrenCount');
  const additionalHoursContainer = document.getElementById('additionalHoursContainer');

  // Function to show/hide the additional hours dropdown
  function toggleAdditionalHoursDropdown() {
    const childrenCount = parseInt(childrenCountSelect.value, 10);
    // Show the additional hours dropdown if there is more than one child
    if (childrenCount > 1) {
      additionalHoursContainer.style.display = 'block';
    } else {
      additionalHoursContainer.style.display = 'none';
    }
  }

  // Event listener for when the number of children changes
  childrenCountSelect.addEventListener('change', toggleAdditionalHoursDropdown);

  singleBtn.addEventListener('click', function() {
    isSingle = true;
    singleBtn.classList.add('active');
    coupleBtn.classList.remove('active');
  });

  coupleBtn.addEventListener('click', function() {
    isSingle = false;
    coupleBtn.classList.add('active');
    singleBtn.classList.remove('active');
  });

  const salarySelect = document.getElementById('salaryRange');
  const salaryLabel = document.getElementById('salaryLabel');

  function updateSalaryOptions(isSingle) {
    while (salarySelect.firstChild) {
      salarySelect.removeChild(salarySelect.firstChild);
    }

    const options = isSingle ? getSingleSalaryOptions() : getCoupleSalaryOptions();
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      salarySelect.appendChild(optionElement);
    });

    salaryLabel.textContent = isSingle ? "Tekjubil fyrir einstæða forelda" : "Tekjubil fyrir par";
  }


  singleBtn.addEventListener('click', function() {
    isSingle = true;
    singleBtn.classList.add('active');
    coupleBtn.classList.remove('active');
    updateSalaryOptions(isSingle);
  });

  coupleBtn.addEventListener('click', function() {
    isSingle = false;
    coupleBtn.classList.add('active');
    singleBtn.classList.remove('active');
    updateSalaryOptions(isSingle);
  });

  // Initialize the salary options based on the default isSingle value
  updateSalaryOptions(isSingle);


  document.getElementById('calculate').addEventListener('click', function() {
    const childrenCount = parseInt(document.getElementById('childrenCount').value, 10);
    const salarySelect = document.getElementById('salaryRange');
    const salary = salarySelect.options[salarySelect.selectedIndex].value;
    const hours = parseFloat(document.getElementById('hours').value);

    // Validate inputs
    if (isNaN(childrenCount) || isNaN(salary) || isNaN(hours)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    try {
      const totalCost = calculateTotalCost(hours, childrenCount, salary, isSingle);
      
      const formattedTotalCost = formatCurrency(totalCost);
      document.getElementById('totalCost').textContent = formattedTotalCost;
      document.getElementById('total').textContent = formattedTotalCost + " kr.";
      document.getElementById('detailsGrid').style.display = 'grid';
    } catch (error) {
      alert(error.message);
    }
  });
});

function getSingleSalaryOptions() {
  return [
    { text: "0 - 430.999", value: "430999" },
    { text: "431.000 - 550.999", value: "550999" },
    { text: "551.000 - 670.999", value: "670999" },
    { text: "> 671.000", value: "671000" },
 
  ];
}

function getCoupleSalaryOptions() {
  return [
    { text: "0 - 689.599", value: "689599" },
    { text: "689.600 - 881.599", value: "881599" },
    { text: "881.600 - 1.073.599", value: "1073599" },
    { text: "> 1.073.600", value: "1073600" },
  ];
}

// Function to calculate the total cost
function calculateTotalCost(hours, childrenCount, salary, isSingle) {
  // Calculate base cost with sibling discount
  let cost = getCostWithSiblingsDiscount(hours, childrenCount);

  // Apply salary-based discount
  const discountPercentage = getDiscountPercentage(salary, isSingle);
  let hoursCost = cost * (1 - discountPercentage);
  document.getElementById('schoolFee').textContent = formatCurrency(hoursCost) + ' kr.';

  // Add food costs
  const totalCost = getCostWithFoodCost(hoursCost, hours, childrenCount);

  return totalCost;
}

// Function to get the hourly cost with siblings discount
function getCostWithSiblingsDiscount(hours, children) {
  let hoursCost = hourCosts[hours] || hourGeneralCost;

  // Apply siblings discount
  if (children > 1) {
    hoursCost += hoursCost * 0.5; // 50% discount for the second child
  }

  return hoursCost;
}

// Function to get the discount percentage based on salary
function getDiscountPercentage(salary, isSingle) {
  // Convert salary string to number for comparison
  salary = Number(salary);
  const discountPercentage =  isSingle ? getSingleSalaryCategory(salary) : getCoupleSalaryCategory(salary);
  document.getElementById('incomeDiscount').textContent = discountPercentage * 100 + '%';
  return discountPercentage;
}

// Functions to get discount percentage based on single and couple salary categories
function getSingleSalaryCategory(salary) {
  if (salary <= 430999) {
    return 0.75;
  } else if (salary <= 550999) {
    return 0.50;
  } else if (salary <= 670999) {
    return 0.25;
  } else {
    return 0.0; // Invalid salary will not apply discount
  }
}

function getCoupleSalaryCategory(salary) {
  if (salary <= 689599) {
    return 0.75;
  } else if (salary <= 881599) {
    return 0.50;
  } else if (salary <= 1073599) {
    return 0.25;
  } else {
    return 0.0; // Invalid salary will not apply discount
  }
}

// Function to calculate the total cost with food
function getCostWithFoodCost(hoursCost, hours, childrenCount) {
  let foodCost = (breakfastCost + lunchCost)*childrenCount;
  // Add afternoon snack cost if hours are 7 or more
  if (hours >= 7) {
    foodCost += afternoonSnackCost * childrenCount;
  }

  document.getElementById('foodFee').textContent = formatCurrency(foodCost) + ' kr.';

  return foodCost + hoursCost;
}

// Function to format the currency
function formatCurrency(number) {
  // Round the number to the nearest whole number
  let roundedNumber = Math.round(number);

  // Convert the number to a string
  let numberStr = roundedNumber.toString();

  // Replace every third digit from the end with a period
  let formatted = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return formatted;
}
