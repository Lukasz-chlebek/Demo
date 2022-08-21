import connect, { sql } from '@databases/expo'
import { Platform } from 'react-native'

export const database = connect('flash-card')

export const ready = () => {
  if (Platform.OS === 'web') {
    throw new Error('Web not supported due to SQLite usage')
  }
  database.tx(function* (tx) {
    yield tx.query(sql`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INT NOT NULL
    );
  `)

    const versionRecord = yield tx.query(sql`
    SELECT version FROM schema_version;
  `)

    const version = versionRecord.length ? versionRecord[0].version : 0

    if (version < 1) {
      yield tx.query(sql`
        CREATE TABLE decks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );
      `)
    }

    if (version < 2) {
      yield tx.query(sql`
        CREATE TABLE cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckid INTEGER NOT NULL,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          FOREIGN KEY(deckid) REFERENCES decks(id)
        );
      `)
    }

    if (version < 3) {
      yield tx.query(sql`
        CREATE TABLE cards_response (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cardid INTEGER NOT NULL,
          response TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          FOREIGN KEY(cardid) REFERENCES cards(id)
        );
      `)
    }

    const LATEST_VERSION = 3
    if (version === 0) {
      yield tx.query(sql`
      INSERT INTO schema_version
      VALUES (${LATEST_VERSION});
    `)
    } else {
      yield tx.query(sql`
      UPDATE schema_version
      SET version = ${LATEST_VERSION};
    `)
    }
  })
}
