const DB_VERSION = 1
const STORE = 'BudgetTransactionsStore'
let db

const request = indexedDB.open('BudgetDB', DB_VERSION);

//If the server version is different, then do the following:
request.onupgradeneeded = function (event) {
  db = event.target.result;
  
  // create object store called "BudgetStore" and set autoIncrement to true
  db.createObjectStore(STORE, { autoIncrement : true })
  console.log(db)
};

// On an error with the db do the following:
request.onerror = function (event) {
  console.log(`RAN INTO AN ERROR`)
  console.log(event)
};

//If the request is successful, and we are online, then check the database for data and transmit
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabaseAndTransmit();
  }
};

// Called by the front end when the app is offline.
// adds new financial transaction to the IndexedDB
const saveRecord = (transaction) => {
    // create a transaction on the pending db with readwrite access
    let transaction = db.transaction('BudgetStore', 'readwrite')
    // access your pending object store
    let budgetStore = transaction.objectStore('BudgetStore')
    // add record to your store with add method.
    budgetStore.add(record)
}

const checkDatabaseAndTransmit = () => {
  
}