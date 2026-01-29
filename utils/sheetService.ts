
import { Transaction, User, TransactionType, UserRole } from '../types';

/* 
  === كود Google Apps Script (تأكد من تحديث الكود في محرر جوجل بهذا النص) ===
  
  function doGet(e) {
    return handleRequest(e);
  }

  function doPost(e) {
    return handleRequest(e);
  }

  function handleRequest(e) {
    const lock = LockService.getScriptLock();
    // تقليل وقت القفل لتجنب تراكم الطلبات
    lock.tryLock(5000);

    try {
      const doc = SpreadsheetApp.getActiveSpreadsheet();
      const action = e.parameter.action || (e.postData && JSON.parse(e.postData.contents).action);
      
      // 1. حالة القراءة (GET or POST)
      if (action === 'load') {
        const transactions = readSheet(doc, 'Transactions');
        const users = readSheet(doc, 'Users');
        
        return createResponse({
          status: 'success',
          data: { transactions: transactions, users: users }
        });
      }

      // 2. حالة الكتابة (POST only)
      if (action === 'save') {
        const data = JSON.parse(e.postData.contents);
        saveSheet(doc, 'Transactions', data.transactions);
        saveSheet(doc, 'Users', data.users);
        return createResponse({ status: 'success', message: 'Saved' });
      }
      
      return createResponse({ status: 'error', message: 'Unknown action: ' + action });

    } catch (error) {
      return createResponse({ status: 'error', message: error.toString() });
    } finally {
      lock.releaseLock();
    }
  }

  function readSheet(doc, sheetName) {
    const sheet = doc.getSheetByName(sheetName);
    if (!sheet) return [];
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return []; 
    return rows;
  }

  function saveSheet(doc, sheetName, data) {
    let sheet = doc.getSheetByName(sheetName);
    if (!sheet) sheet = doc.insertSheet(sheetName);
    sheet.clear(); 
    if (data && data.length > 0) {
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    }
  }

  function createResponse(payload) {
    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  }
*/

export const SHEET_HEADERS = [
  'ID', 'Invoice Number', 'Date', 'Type', 'Description', 'Amount', 'Quantity', 'Total', 'Customer'
];

export const USERS_HEADERS = [
  'ID', 'Name', 'Email', 'Password', 'Role'
];

// --- Helper Functions ---

export const formatTransactionsForSheet = (transactions: Transaction[]) => {
  return [
    SHEET_HEADERS,
    ...transactions.map(t => [
      t.id,
      t.invoiceNumber,
      t.date,
      t.type,
      t.description,
      t.amount,
      t.quantity,
      t.amount * t.quantity,
      t.customerName || ''
    ])
  ];
};

export const formatUsersForSheet = (users: User[]) => {
  return [
    USERS_HEADERS,
    ...users.map(u => [
      u.id,
      u.name,
      u.email,
      u.password,
      u.role
    ])
  ];
};

export const parseSheetDataToTransactions = (rows: any[]): Transaction[] => {
  if (!rows || rows.length < 2) return [];
  // Skip header row (index 0)
  return rows.slice(1).map(row => ({
    id: String(row[0]),
    invoiceNumber: String(row[1]),
    date: String(row[2]),
    type: row[3] as TransactionType,
    description: String(row[4]),
    amount: Number(row[5]),
    quantity: Number(row[6]),
    customerName: String(row[8])
  }));
};

export const parseSheetDataToUsers = (rows: any[]): User[] => {
  if (!rows || rows.length < 2) return [];
  return rows.slice(1).map(row => ({
    id: String(row[0]),
    name: String(row[1]),
    email: String(row[2]),
    password: String(row[3]),
    role: row[4] as UserRole
  }));
};

// --- API Calls ---

const sanitizeUrl = (url: string) => {
  let clean = url.trim();
  
  // 1. Fix /edit URL
  if (clean.includes('/edit')) {
    clean = clean.replace(/\/edit.*/, '/exec');
  }
  
  // 2. Strip existing params to append fresh ones later
  if (clean.includes('?')) {
    clean = clean.split('?')[0];
  }

  // 3. Ensure ends with /exec
  if (!clean.endsWith('/exec') && !clean.endsWith('/dev')) {
    clean = clean.endsWith('/') ? `${clean}exec` : `${clean}/exec`;
  }
  
  return clean;
};

export const loadFromGoogleSheet = async (scriptUrl: string) => {
  if (!scriptUrl) return null;

  const cleanUrl = sanitizeUrl(scriptUrl);
  // Use GET with cache busting timestamp
  const fetchUrl = `${cleanUrl}?action=load&_t=${Date.now()}`;

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
    });
    
    const text = await response.text();
    
    // Check for HTML error (Auth/404/Permissions)
    if (text.trim().startsWith('<')) {
      console.error("Sync Error (Load): Received HTML. Check Permissions.");
      return null;
    }

    try {
      const json = JSON.parse(text);
      if (json.status === 'success') {
        return {
          transactions: parseSheetDataToTransactions(json.data.transactions),
          users: parseSheetDataToUsers(json.data.users)
        };
      }
    } catch (e) {
      console.error("JSON Parse Error:", e, text.substring(0, 100));
    }
    return null;
  } catch (error) {
    console.error("Load failed (Network):", error);
    return null;
  }
};

export const saveToGoogleSheet = async (scriptUrl: string, data: { transactions: Transaction[], users: User[] }) => {
  if (!scriptUrl) return false;
  
  const cleanUrl = sanitizeUrl(scriptUrl);

  const payload = {
    action: 'save',
    transactions: formatTransactionsForSheet(data.transactions),
    users: formatUsersForSheet(data.users)
  };

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    
    if (text.trim().startsWith('<')) {
      console.error("Save Error: Received HTML. Permissions might be wrong.");
      return false;
    }

    try {
        const json = JSON.parse(text);
        return json.status === 'success';
    } catch (e) {
        // Sometimes GAS returns empty or plain text on success depending on implementation
        return true; 
    }
  } catch (error) {
    console.error("Save failed (Network):", error);
    return false;
  }
};

export const initializeSheetStructure = async (scriptUrl: string) => {
  // Test connection by trying to load
  const result = await loadFromGoogleSheet(scriptUrl);
  return !!result;
};
