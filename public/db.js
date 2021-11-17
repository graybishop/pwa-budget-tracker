const DB_VERSION = 1;
const STORE = 'BudgetTransactionsStore';
let db;

const request = indexedDB.open('BudgetDB', DB_VERSION);

//If the server version is different, then do the following:
request.onupgradeneeded = (event) => {
  db = event.target.result;

  // create object store called "BudgetStore" and set autoIncrement to true
  db.createObjectStore(STORE, { autoIncrement: true });
  console.log(db);
};

// On an error with the db do the following:
request.onerror = (event) => {
  console.log(`RAN INTO AN ERROR`);
  console.log(event);
};

//If the request is successful, and we are online, then check the database for data and transmit
//Used if the user visits the site for the first time after being offline
request.onsuccess = (event) => {
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
  let transaction = db.transaction(STORE, 'readwrite');
  // accessing object store from the transaction
  let budgetStore = transaction.objectStore(STORE);
  // add record to store with add method.
  budgetStore.add(userTransaction);
};

//Checks for any records in the store, and transmits them to the db
const checkDatabaseAndTransmit = () => {
  //open a read transaction
  let transaction = db.transaction(STORE);
  //drill into the transaction for direct access to the store
  let budgetStore = transaction.objectStore(STORE);
  //pull all records from the store
  let allUserTransactionsRequest = budgetStore.getAll();

  //Wait for it to be successful, then perform a fetch request to our bulk api endpoint
  allUserTransactionsRequest.onsuccess = async () => {
    if (allUserTransactionsRequest.result.length > 0) {
      let response = await fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(allUserTransactionsRequest.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      let responseJSON = await response.json();
      // If our returned response is not empty
      if (responseJSON.length !== 0) {
        console.log('Items saved to DB', responseJSON);
        // Open another transaction to BudgetStore with the ability to read and write
        transaction = db.transaction(STORE, 'readwrite');

        // Assign the current store to a variable
        const budgetStore = transaction.objectStore(STORE);

        // Clear existing entries because our bulk add was successful
        budgetStore.clear();
        console.log('Clearing store 🧹');
      }
    }
  };
};

window.addEventListener('online', checkDatabaseAndTransmit);