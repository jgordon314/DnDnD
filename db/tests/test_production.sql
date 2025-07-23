SOURCE prod/load_prod.sql;

-- R6
SELECT id, username FROM Users WHERE username = 'mwgrk' AND password = '13104';
INSERT INTO Users (username, password) VALUES ('billnye', 'the5c1enceguy!');
SELECT id, username FROM Users WHERE username = 'billnye' AND password = 'the5c1enceguy!';

-- R7
UPDATE CharacterSpellList csi SET activations = activations + 1 WHERE csi.spell_id = 1 AND csi.character_id = 1;
UPDATE CharacterInventory ci JOIN Items i ON ci.item_id = i.id SET ci.activation_count = ci.activation_count + 1 WHERE ci.character_id = 1 AND i.ability_id = 1;

-- R8
(
    SELECT sd.*, 1 AS multiplier
    FROM SkillDeltas sd, Characters c
    WHERE c.id = 1 AND sd.id = c.base_stat_id
) UNION ALL (
    SELECT sd.*, csl.activations AS multiplier
    FROM SkillDeltas sd, Spells s, CharacterSpellList csl, Characters c
    WHERE c.id = 1 AND s.id = csl.spell_id AND csl.character_id = c.id AND sd.id = s.skill_delta_id AND csl.activations > 0
) UNION ALL (
    SELECT sd.*, ca.activation_count AS multiplier
    FROM SkillDeltas sd, Abilities a, CharacterAbilities ca, Characters c
    WHERE c.id = 1 AND a.id = ca.ability_id AND ca.character_id = c.id AND sd.id = a.skill_delta_id AND ca.activation_count > 0
) UNION ALL (
    SELECT sd.*, ci.activation_count AS multiplier
    FROM SkillDeltas sd, Abilities a, Items i, CharacterInventory ci, Characters c
    WHERE c.id = 1 AND i.id = ci.item_id AND ci.character_id = c.id AND a.id = i.ability_id AND sd.id = a.skill_delta_id AND ci.activation_count > 0
);

-- R9
UPDATE CharacterInventory SET activation_count = 0 WHERE character_id = 1 AND item_id = 1;

-- R10
SELECT a.* FROM Abilities a LEFT JOIN CharacterAbilities ca ON a.id = ca.ability_id AND ca.character_id = 1 WHERE ca.character_id IS NULL LIMIT 5;
SELECT i.* FROM Items i LEFT JOIN CharacterInventory ci ON i.id = ci.item_id AND ci.character_id = 1 WHERE ci.character_id IS NULL LIMIT 5;
SELECT s.* FROM Spells s LEFT JOIN CharacterSpellList csl ON s.id = csl.spell_id AND csl.character_id = 1 WHERE csl.character_id IS NULL LIMIT 5;

-- R11
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
SELECT Items.name AS item_name, Items.description AS item_description,
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

-- R12
CREATE VIEW CharacterBaseCharismas AS
SELECT Characters.id AS character_id, Characters.name AS character_name, SkillDeltas.charisma AS character_base_charisma
FROM Characters, SkillDeltas WHERE Characters.base_stat_id = SkillDeltas.id;

SELECT * FROM CharacterBaseCharismas WHERE character_id = 4;
UPDATE SkillDeltas SET charisma = charisma + 3 WHERE id = (SELECT base_stat_id FROM Characters WHERE id = 4);
SELECT * FROM CharacterBaseCharismas WHERE character_id = 4;

DROP VIEW CharacterBaseCharismas;

-- R13
CREATE INDEX CharacterUserId ON Characters(user_id);
SELECT * FROM Characters WHERE user_id = 2; 

-- R14
START TRANSACTION;
    UPDATE CharacterInventory SET activation_count = 0 WHERE character_id = 1 AND activation_count > 0;
    UPDATE CharacterAbilities SET activation_count = 0, available_uses = max_uses WHERE character_id = 1;
    UPDATE CharacterSpellList SET activations = 0 WHERE character_id = 1;
    UPDATE SkillDeltas s JOIN Characters c ON c.base_stat_id = s.id SET s.current_health = s.max_health WHERE c.id = 1;
COMMIT;

-- R15
CREATE UNIQUE INDEX CharacterId ON Characters(id);
CREATE INDEX CharacterSpellListCharacterId ON CharacterSpellList(character_id);
CREATE INDEX CharacterInventoryId ON CharacterInventory(character_id);
CREATE INDEX CharacterAbilitiesId ON CharacterAbilities(character_id);

INSERT INTO CharacterSpellList (character_id, spell_id, activations) VALUES (2, 11, 3);
SELECT Characters.name AS charcter_name, Spells.name AS spell_name, CharacterSpellList.activations AS activations
FROM Characters, Spells, CharacterSpellList
WHERE Characters.id = 2 AND Characters.id = CharacterSpellList.character_id AND Spells.id = CharacterSpellList.spell_id LIMIT 5;

INSERT INTO CharacterInventory (character_id, item_id, quantity) VALUES (4, 5, 2);
SELECT Characters.name AS charcter_name, Items.name AS item_name, CharacterInventory.quantity AS item_quantity
FROM Characters, Items, CharacterInventory
WHERE Characters.id = 3 AND Characters.id = CharacterInventory.character_id AND Items.id = CharacterInventory.item_id LIMIT 5;

INSERT INTO CharacterAbilities (character_id, ability_id) VALUES (4, 8);
SELECT Characters.name AS charcter_name, Abilities.name AS ability_name
FROM Characters, Abilities, CharacterAbilities
WHERE Characters.id = 4 AND Characters.id = CharacterAbilities.character_id AND Abilities.id = CharacterAbilities.ability_id LIMIT 5;
