## Сервер

Точка входа - [/app/index.js](../app/index.js).
Сервер:
- отдаёт статику из '/public' (или другой папки, если это переопределено в [конфиге](config.md))
- предоставляет несколько точек апи (API endpoints) для клиентов
- генерирует динамические страницы по шаблонам [handlebars](http://handlebarsjs.com/)

Статические и динамические страницы определяются в карте сайта, эндпоинты - в [`/app/server/api.js`](../app/server/api.js).

## Конфиг

Конфиг сервера лежит в [`/app/config.js`](../app/config.js). Названия опций самодокументируемые.

Карта сайта берётся из [`/app/sitemap.js`](../app/sitemap.js). Каждый элемент карты содержит следующие поля:

<table>
	<tr>
		<th>Имя поля</th>
		<th>Описание</th>
		<th>Значение по умолчанию</th>
	</tr>
	<tr>
		<td>name</td>
		<td>Относительный адрес страницы на сайте</td>
		<td><b>(это обязательное поле)</b></td>
	</tr>
	<tr>
		<td>filename</td>
		<td>Имя выходного файла</td>
		<td>public/[name]index.html</td>
	</tr>
	<tr>
		<td>entry</td>
		<td>Имя корневого скрипта</td>
		<td>pages/[name]index.js</td>
	</tr>
	<tr>
		<td>template</td>
		<td>Имя исходного файла шаблона</td>
		<td>pages/[name]index.handlebars</td>
	</tr>
	<tr>
		<td>isDynamic</td>
		<td>Является ли страница динамически генерируемой</td>
		<td>false</td>
	</tr>
</table>
