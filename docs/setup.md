## Настройка окружения

```bash
# клонируем репозиторий
git clone git@github.com:BobNobrain/noties.git
cd noties
# устанавливаем зависимости
npm install
# добавляем несколько полезных алиасов
source aliases
# алиас для './build.sh' - собирает статический фронтэнд
build
# ещё один алиас, поднимает БД и генерирует её наполнение
run db --gen-data
# запускает сервер
run
```
