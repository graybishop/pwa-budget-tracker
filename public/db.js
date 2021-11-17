const DB_VERSION = 1
const STORE = 'BudgetTransactionsStore'
let db

const request = indexedDB.open('BudgetDB', DB_VERSION);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  
  // create object store called "BudgetStore" and set autoIncrement to true
  db.createObjectStore(STORE, { autoIncrement : true })
  console.log(db)
};


// Called by the front end when the app is offline
const saveRecord = (transaction) => {
  
}