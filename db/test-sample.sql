-- R6
SELECT id FROM Users WHERE username = ‘that_yuck’ AND password = ‘Amogus32!’;
INSERT INTO Users (username, password) VALUES (‘billybin’, ‘aceattorney222’);

-- R7
SELECT * FROM Characters WHERE user_id = 2; 

-- R8
START TRANSACTION; 
INSERT INTO SkillDeltas (
  armor_class, current_health, max_health,
  Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma,
  Acrobatics, Animal_Handling, Arcana, Athletics, Deception,
  History, Insight, Intimidation, Investigation, Medicine,
  Nature, Perception, Performance, Persuasion, Religion,
  Sleight_of_Hand, Stealth, Survival
) VALUES (
  3, 12, 20,
  10, 14, 12, 11, 13, 9,
  2, 1, 3, 4, 0,
  2, 3, 1, 2, 1,
  2, 4, 0, 1, 3,
  2, 5, 2
);

INSERT INTO Spells (name, level, description, skill_delta_id)
VALUES ('Firebolt', 0, 'A bolt of fire deals 1d10 damage.', LAST_INSERT_ID());
COMMIT;
START TRANSACTION; 
INSERT INTO SkillDeltas (
  armor_class, current_health, max_health,
  Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma,
  Acrobatics, Animal_Handling, Arcana, Athletics, Deception,
  History, Insight, Intimidation, Investigation, Medicine,
  Nature, Perception, Performance, Persuasion, Religion,
  Sleight_of_Hand, Stealth, Survival
) VALUES (
  2, 8, 15,
  9, 13, 11, 12, 10, 8,
  1, 0, 4, 2, 3,
  1, 2, 0, 3, 1,
  2, 3, 1, 2, 1,
  2, 3, 2
);

INSERT INTO Items (name, description, skill_delta_id)
VALUES ('Healing Potion', '{"Effect": "Restore 2d4 + 2 HP"}', LAST_INSERT_ID());
COMMIT;
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
INSERT INTO Abilities (name, type, description, skill_delta_id)
VALUES ('Rage', 2, 'Enter a frenzied rage for 1 minute.', LAST_INSERT_ID());
COMMIT;

-- R9
UPDATE SkillDeltas SET charisma = charisma + 3 WHERE id = 10;
SELECT base_stat_id FROM Characters WHERE id = 2; 

-- R10
-- R10 queries still have parameters that are yet to be filled in
INSERT IGNORE INTO CharacterSpellList (character_id, spell_id, activations) VALUES (:character_id, :spell_id, 0);
INSERT IGNORE INTO CharacterInventory (character_id, item_id, quantity) VALUES (:character_id, :item_id, :quantity);
INSERT IGNORE INTO CharacterAbilities (character_id, ability_id) VALUES (:character_id, :ability_id);
