from app.models import create_table, add_transaction

create_table()

add_transaction("income", 1000.0, "Salary", "2024-11-14")
# Тестовая транзакция

print("Тестовая транзакция добавлена успешно.")