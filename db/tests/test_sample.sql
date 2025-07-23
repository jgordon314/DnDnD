-- These sample queries are for the basic features outlined in milestone 2. Between milestone 2 and milestone 3 some basic and advanced features were switched around, so the numbering of test_sample.sql may not correspond to test_production.sql.

-- Load sample fixtures
SOURCE db/fixtures/load_sample.sql;

-- R6
SELECT id, username FROM Users WHERE username = 'that_yuck' AND password = 'Amogus32!';
INSERT INTO Users (username, password) VALUES ('billnye', 'the5c1enceguy!');
SELECT id, username FROM Users WHERE username = 'billnye' AND password = 'the5c1enceguy!';

-- R7
SELECT * FROM Characters WHERE user_id = 2; 

-- R8
START TRANSACTION; 

INSERT INTO SkillDeltas (
  armor_class, current_health, max_health,
  strength, dexterity, constitution, intelligence, wisdom, charisma,
  acrobatics, animal_handling, arcana, athletics, deception,
  history, insight, intimidation, investigation, medicine,
  nature, perception, performance, persuasion, religion,
  sleight_of_hand, stealth, survival
) VALUES (
  3, 12, 20,
  10, 14, 12, 11, 13, 9,
  2, 1, 3, 4, 0,
  2, 3, 1, 2, 1,
  2, 4, 0, 1, 3,
  2, 5, 2
);

INSERT INTO Spells (name, level, description, skill_delta_id, components) VALUES ('Firebolt', 0, 'A bolt of fire deals 1d10 damage.', LAST_INSERT_ID(), '');

COMMIT;

SELECT name, level, description FROM Spells WHERE id = LAST_INSERT_ID();


START TRANSACTION; 

INSERT INTO SkillDeltas (
  armor_class, current_health, max_health,
  strength, dexterity, constitution, intelligence, wisdom, charisma,
  acrobatics, animal_handling, arcana, athletics, deception,
  history, insight, intimidation, investigation, medicine,
  nature, perception, performance, persuasion, religion,
  sleight_of_hand, stealth, survival
) VALUES (
  2, 8, 15,
  9, 13, 11, 12, 10, 8,
  1, 0, 4, 2, 3,
  1, 2, 0, 3, 1,
  2, 3, 1, 2, 1,
  2, 3, 2
);

INSERT INTO Abilities (name, type, description, skill_delta_id) VALUES ('Heal', 'action', 'Restore 2d4 + 2 HP', LAST_INSERT_ID());

INSERT INTO Items (name, description, ability_id) VALUES ('Healing Potion', 'Effect: Restore 2d4 + 2 HP', LAST_INSERT_ID());

COMMIT;

SELECT
Items.name AS item_name, Items.description AS item_description,
Abilities.name AS ability_name, Abilities.type AS ability_type, Abilities.description AS ability_description
FROM Items, Abilities WHERE Items.id = LAST_INSERT_ID() AND Items.id = Abilities.id;


START TRANSACTION; 

INSERT INTO SkillDeltas (
  armor_class, current_health, max_health,
  Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma,
  Acrobatics, Animal_Handling, Arcana, Athletics, Deception,
  History, Insight, Intimidation, Investigation, Medicine,
  Nature, Perception, Performance, Persuasion, Religion,
  Sleight_of_Hand, Stealth, Survival
) VALUES (
  5, 20, 25,
  15, 12, 13, 11, 10, 14,
  3, 2, 1, 5, 2,
  4, 1, 2, 3, 2,
  1, 3, 2, 3, 4,
  1, 1, 3
);

INSERT INTO Abilities (name, type, description, skill_delta_id) VALUES ('Rage', 2, 'Enter a frenzied rage for 1 minute.', LAST_INSERT_ID());

COMMIT;

SELECT name, type, description FROM Abilities WHERE id = LAST_INSERT_ID();

-- R9
CREATE VIEW CharacterBaseCharismas AS
SELECT Characters.id AS character_id, Characters.name AS character_name, SkillDeltas.charisma AS character_base_charisma
FROM Characters, SkillDeltas WHERE Characters.base_stat_id = SkillDeltas.id;

SELECT * FROM CharacterBaseCharismas WHERE character_id = 4;
UPDATE SkillDeltas SET charisma = charisma + 3 WHERE id = (SELECT base_stat_id FROM Characters WHERE id = 4);
SELECT * FROM CharacterBaseCharismas WHERE character_id = 4;

DROP VIEW CharacterBaseCharismas;

-- R10
INSERT INTO CharacterSpellList (character_id, spell_id, activations) VALUES (2, 3, 3);
SELECT Characters.name AS charcter_name, Spells.name AS spell_name, CharacterSpellList.activations AS activations
FROM Characters, Spells, CharacterSpellList
WHERE Characters.id = 2 AND Characters.id = CharacterSpellList.character_id AND Spells.id = CharacterSpellList.spell_id;

INSERT INTO CharacterInventory (character_id, item_id, quantity) VALUES (3, 6, 2);
SELECT Characters.name AS charcter_name, Items.name AS item_name, CharacterInventory.quantity AS item_quantity
FROM Characters, Items, CharacterInventory
WHERE Characters.id = 3 AND Characters.id = CharacterInventory.character_id AND Items.id = CharacterInventory.item_id;

INSERT INTO CharacterAbilities (character_id, ability_id) VALUES (4, 9);
SELECT Characters.name AS charcter_name, Abilities.name AS ability_name
FROM Characters, Abilities, CharacterAbilities
WHERE Characters.id = 4 AND Characters.id = CharacterAbilities.character_id AND Abilities.id = CharacterAbilities.ability_id;
