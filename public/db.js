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
//Used if the user visits the site for the first time after being offline
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabaseAndTransmit();
  }
};

// Called by the front end when the app is offline.
// adds new financial transaction to the IndexedDB
// eslint-disable-next-line no-unused-vars
const saveRecord = (userTransaction) => {
    // create a transaction on the db with readwrite access
    let transaction = db.transaction(STORE, 'readwrite')
    // accessing object store from the transaction
    let budgetStore = transaction.objectStore(STORE)
    // add record to store with add method.
    budgetStore.add(userTransaction)
}

const checkDatabaseAndTransmit = () => {
  
}