DROP TABLE IF EXISTS CharacterInventory, CharacterAbilities, CharacterSpellList, Items, Abilities, Spells, Characters, SkillDeltas, Users;

CREATE TABLE Users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE SkillDeltas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  armor_class INT NOT NULL DEFAULT 0,
  current_health INT NOT NULL DEFAULT 0,
  max_health INT NOT NULL DEFAULT 0,
  strength INT NOT NULL DEFAULT 0,
  dexterity INT NOT NULL DEFAULT 0,
  intelligence INT NOT NULL DEFAULT 0,
  wisdom INT NOT NULL DEFAULT 0,
  charisma INT NOT NULL DEFAULT 0,
  constitution INT NOT NULL DEFAULT 0,
  athletics INT NOT NULL DEFAULT 0,
  acrobatics INT NOT NULL DEFAULT 0,
  sleight_of_hand INT NOT NULL DEFAULT 0,
  stealth INT NOT NULL DEFAULT 0,
  arcana INT NOT NULL DEFAULT 0,
  history INT NOT NULL DEFAULT 0,
  investigation INT NOT NULL DEFAULT 0,
  nature INT NOT NULL DEFAULT 0,
  religion INT NOT NULL DEFAULT 0,
  animal_handling INT NOT NULL DEFAULT 0,
  insight INT NOT NULL DEFAULT 0,
  medicine INT NOT NULL DEFAULT 0,
  perception INT NOT NULL DEFAULT 0,
  survival INT NOT NULL DEFAULT 0,
  deception INT NOT NULL DEFAULT 0,
  intimidation INT NOT NULL DEFAULT 0,
  performance INT NOT NULL DEFAULT 0,
  persuasion INT NOT NULL DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE Characters (
  id INT unsigned NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  user_id int UNSIGNED NOT NULL,
  base_stat_id int UNSIGNED NOT NULL UNIQUE,
  PRIMARY KEY(id),
  UNIQUE (user_id, name),
  FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY(base_stat_id) REFERENCES SkillDeltas(id) ON DELETE RESTRICT
);

CREATE TABLE Spells (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  level INT UNSIGNED NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  duration INT DEFAULT 0,
  skill_delta_id INT UNSIGNED UNIQUE,
  casting_time VARCHAR(100) NOT NULL DEFAULT '',
  spell_range VARCHAR(100) NOT NULL DEFAULT '',
  components TEXT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (skill_delta_id) REFERENCES SkillDeltas(id) ON DELETE SET NULL
);

CREATE TABLE Abilities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  skill_delta_id INT UNSIGNED UNIQUE,
  type ENUM('non-action', 'action', 'bonus-action', 'reaction', 'free-action') NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(skill_delta_id) REFERENCES SkillDeltas(id) ON DELETE SET NULL
);

CREATE TABLE Items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  ability_id INT UNSIGNED,
  PRIMARY KEY (id),
  FOREIGN KEY (ability_id) REFERENCES Abilities(id) ON DELETE SET NULL
);

CREATE TABLE CharacterSpellList (
  character_id INT UNSIGNED NOT NULL,
  spell_id INT UNSIGNED NOT NULL,
  activations INT DEFAULT 0 NOT NULL,
  PRIMARY KEY(character_id, spell_id),
  FOREIGN KEY(character_id) REFERENCES Characters(id) ON DELETE CASCADE,
  FOREIGN KEY(spell_id) REFERENCES Spells(id) ON DELETE CASCADE
);

CREATE TABLE CharacterAbilities (
  character_id INT UNSIGNED NOT NULL,
  ability_id INT UNSIGNED NOT NULL,
  activation_count INT UNSIGNED DEFAULT 0 NOT NULL, 
  max_uses INT,
  available_uses INT,
  PRIMARY KEY(character_id, ability_id),
  FOREIGN KEY(character_id) REFERENCES Characters(id) ON DELETE CASCADE,
  FOREIGN KEY(ability_id) REFERENCES Abilities(id) ON DELETE CASCADE
);

CREATE TABLE CharacterInventory (
  character_id INT UNSIGNED NOT NULL,
  item_id INT UNSIGNED NOT NULL,
  quantity INT DEFAULT 0 NOT NULL,
  activation_count INT DEFAULT 0 NOT NULL,
  PRIMARY KEY (item_id, character_id),
  FOREIGN KEY(character_id) REFERENCES Characters(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES Items(id) ON DELETE CASCADE
);
