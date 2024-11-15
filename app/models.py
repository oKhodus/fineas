import sqlite3 as sq

def create_table():
    conn = sq.connect("finances.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            date TEXT
        );
''')
    
    conn.commit()
    conn.close()

def add_transaction(transaction_type,
                    amount,
                    description, 
                    date):
    conn = sq.connect("finances.db")
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO transactions (type, amount, description, date)
        VALUES (?, ?, ?, ?)
''', (transaction_type,
      amount,
      description, 
      date))
    
    conn.commit()
    conn.close()

