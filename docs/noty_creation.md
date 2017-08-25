## Процесс создания и обновления заметки

Клиент: `>`, Сервер: `<`

(пользователь нажимает "Создать заметку")

```
> POST /api/noties ({ name })
< { uuid, name, creator }
```

(пользователь редактирует заметку и нажимает "сохранить")

```
> POST /api/noties/<uuid> (Content-Type: multipart/form-data { ... })
  // здесь сервер выполняет запись нового содержимого в файл заметки (TODO: Merger)
< { success: true } // TODO: diff
```

(пользователь редактирует название заметки)

```
> POST /api/noties/<uuid> (Content-Type: application/json { name })
< { success: true, noty: { ... } }
```

(пользователь добавляет файл)

```
> POST /api/noties/<uuid>/file (Content-Type: application/json { name, mime })
< { success: true, uuid }
> POST /api/noties/<uuid>/file/<uuid> (Content-Type: multipart/form-data { ... })
< { success: true }
```
