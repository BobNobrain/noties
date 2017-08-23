# Noties

Cloud service for creating and sharing notes

## Docs

- Commands
- DB
- Entities
- Server
- Setup
- Structure

## Setup

```bash
# clone the repo
git clone git@github.com:BobNobrain/noties.git
cd noties
# install dependencies
npm install
# add some handy aliases for build and run
source aliases
# alias for './build.sh' - builds static frontend files
build
# also an alias, runs noties server at port specified in config.js
run
```

## Entities

```
// an user account
User : {
	uuid: uuid (index, PK),
	username: string (index, unique),
	password: string,
	avatar: File.uuid,
	plan_id: Plan.plan_id,
	paid_until: date, // deadline at which user will be forced to use free plan (if not paid more)
	black_list: [User.uuid]
}

// a note
Noty : {
	uuid: uuid (index, PK),
	name: string (index),
	content: File.uuid, // markdown content with links to attached files (images and not only images)
	files: [File.uuid]
}

// a file, which content is stored in FS
File : {
	uuid: uuid (index, PK),
	owner: User.uuid (index),
	size: int // bytes
}

// a pricing plan (tariff) for users
Plan : {
	id: int (index, PK), // there will be few ones
	name: string,
	period: int, // enum: ['day', 'month', ...]
	price: int,
	// plan limitations:
	max_files_size: long, // bytes
	max_notes: int
}

// an entity for a noty that was shared to some known users
SharedNoty : {
	uuid: uuid (index, PK),
	readers: [User.uuid],
	writers: [User.uuid],
	source: Noty.uuid
}

// an entity for a noty that can be accessed by everyone
PublicNoty : {
	uuid: uuid (index, PK),
	mode: int, // r/w
	source: Noty.uuid
}

```

## Relations

```
// friends and followers
Friends (User * User) : {
	from: User.uuid,
	to: User.uuid,
	accepted: bool
}

```
