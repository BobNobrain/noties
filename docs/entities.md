## Сущности

uuid - шестнадцатеричное случайно генерируемое число, см. [RFC 4122](https://tools.ietf.org/html/rfc4122)

PK - primary key, первичный ключ

index - по полю есть индекс

unique - значения уникальны

```
// профиль пользователя
User : {
	uuid: uuid (index, PK),
	username: string (index, unique),
	password: string,
	avatar: File.uuid,
	plan_id: Plan.plan_id,
	paid_until: date, // крайняя дата, после которой пользователь переводится на бесплатный план
	black_list: [User.uuid]
}

// собственно записка
Noty : {
	uuid: uuid (index, PK),
	name: string (index),
	owner: User.uuid (index),
	content: File.uuid, // содержимое в маркдауне, содержащее ссылки на другие файлы (изображения и т.д.)
	files: [File.uuid] // все файлы, на которые есть ссылки в тексте
}

// файл, содержимое которого хранится в файловой системе (см. Файлы)
File : {
	uuid: uuid (index, PK),
	name: string,
	owner: User.uuid (index),
	type: string, // mime
	size: int // bytes
}

// тарифный план пользователя
Plan : {
	plan_id: int (index, PK), // их будет немного
	name: string,
	period: int, // enum: ['day', 'month', ...]
	price: int,
	// ограничения тарифа:
	max_files_size: long, // bytes
	max_notes: int
}

// сущность для записки, которая была зашарена каким-либо известным пользователям
SharedNoty : {
	uuid: uuid (index, PK),
	readers: [User.uuid],
	writers: [User.uuid],
	source: Noty.uuid
}

// сущность для записки, которая была зашарена всему миру
PublicNoty : {
	uuid: uuid (index, PK),
	mode: int, // r/w - чтение/запись
	source: Noty.uuid
}

```

## Отношения

```
// друзья и заявки в друзья
Friends (User * User) : {
	from: User.uuid (index),
	to: User.uuid (index),
	accepted: bool
}

```
