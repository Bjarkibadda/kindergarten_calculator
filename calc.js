// Constants
const HOUR_GENERAL_COST = 4278;
const breakfastCost = 2908;
const lunchCost = 6925;
const afternoonSnackCost = 2908;

//breytur
var childrenCount
var hours
var secondHours = 0
var totalCost
var discountPercentage
var timeCost
var costForNt

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
    salaryLabel.textContent = isSingle ? "Tekjubil fyrir einstæða forelda" : "Tekjubil fyrir par";
  });

  coupleBtn.addEventListener('click', function() {
    isSingle = false;
    coupleBtn.classList.add('active');
    singleBtn.classList.remove('active');
    salaryLabel.textContent = isSingle ? "Tekjubil fyrir einstæða forelda" : "Tekjubil fyrir par";
  });

  const salaryLabel = document.getElementById('salaryLabel');

    document.getElementById('single').addEventListener('click', function() {
      document.getElementById('singleSalary').style.display = 'block';
      document.getElementById('coupleSalary').style.display = 'none';
      isSingle = true;
      salaryLabel.textContent = "Tekjubil fyrir einstæða forelda"
    });
    
    document.getElementById('couple').addEventListener('click', function() {
      document.getElementById('singleSalary').style.display = 'none';
      document.getElementById('coupleSalary').style.display = 'block';
      isSingle = false;
      salaryLabel.textContent = "Tekjubil fyrir par";

    });

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

  document.getElementById('calculate').addEventListener('click', function() {
    ///todo: add validation to the fields;

    childrenCount = Number(document.getElementById('childrenCount').value);
    discountPercentage = isSingle ? Number(document.getElementById('singleSalary').value): Number(document.getElementById('coupleSalary').value);
    hours = Number(document.getElementById('hours').value);
    var timeCostWithoutDiscount = 0;
    var salaryDiscount = 0;
    var siblingsDiscount = 0;
    
    if(childrenCount === 0 || hours === 0){
      totalCost = 0;
    }

    if(childrenCount === 1){
      timeCost = HOUR_GENERAL_COST * hours;
      timeCostWithoutDiscount = timeCost;
    }
  

    if(childrenCount > 1){
  
      secondHours = Number(document.getElementById('additionalHours').value); 
      // 50% afsláttur á elsta barni
      siblingsDiscount += HOUR_GENERAL_COST * hours * 0.5;

      timeCost = siblingsDiscount;

      timeCost += HOUR_GENERAL_COST * secondHours;
      
      //bætum við tímagjaldi á barn nr tvö miðað við innslegnar forsendur. Börn umfram það reiknaðar m.v. fyrsta barn.
      timeCostWithoutDiscount += HOUR_GENERAL_COST * secondHours + HOUR_GENERAL_COST * hours + HOUR_GENERAL_COST * hours *(childrenCount-2);

      //bætum við í systkynaafslátt 100% fyrir barn nr 3 og 4, ef til staðar.
      siblingsDiscount += HOUR_GENERAL_COST* hours *(childrenCount-2);
    }

    //reikna afslátt vegna launa
    salaryDiscount = timeCost * discountPercentage
    timeCost = timeCost * (1-discountPercentage);

    //reikna matarkostnað.
    var foodCost = (breakfastCost + lunchCost)*childrenCount
    
    if(hours >=7){
      foodCost +=afternoonSnackCost;
    }

     if(childrenCount === 2 && secondHours >=7 ){
      foodCost +=afternoonSnackCost;
    }

    // ef börnin eru fleiri en tvö, þá gerum við ráð fyrir að börn 3 og 4 séu jafn lengi og barn eitt á leikskólanum.
    else if(childrenCount > 2 && hours >= 7){
      foodCost += afternoonSnackCost *(childrenCount-2);
    }

    totalCost = timeCost + foodCost;

    costForNt = timeCostWithoutDiscount/0.1082 + salaryDiscount + siblingsDiscount;
  

    try {
      const formattedTotalCost = formatCurrency(totalCost);
      document.getElementById('totalCost').textContent = formattedTotalCost;
      document.getElementById('total').textContent = formattedTotalCost + " kr.";
      document.getElementById('detailsGrid').style.display = 'grid';
      document.getElementById('incomeDiscount').textContent = discountPercentage * 100 + '%';
      document.getElementById('foodFee').textContent = formatCurrency(foodCost) + ' kr.';
      document.getElementById('schoolFee').textContent = formatCurrency(timeCost) + ' kr.';
      document.getElementById('ntTotal').textContent = formatCurrency(costForNt) + ' kr.';

    } catch (error) {
      alert(error.message);
    }
});

// Function to format the currency
function formatCurrency(number) {
  // Round the number to the nearest whole number
  let roundedNumber = Math.round(number);

  // Convert the number to a string
  let numberStr = roundedNumber.toString();

  // Replace every third digit from the end with a period
  let formatted = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return formatted;
}})
