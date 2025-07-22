-- Run from repo root
SOURCE db/schema.sql;

-- Load sample data
SOURCE db/fixtures/production/1_create_users.sql;
SOURCE db/fixtures/production/2_create_deltas.sql;
SOURCE db/fixtures/production/3_create_characters.sql;
SOURCE db/fixtures/production/4_create_spells.sql;
SOURCE db/fixtures/production/5_create_abilities.sql; 
SOURCE db/fixtures/production/6_create_items.sql;
SOURCE db/fixtures/production/7_create_character_spell_list.sql; 
SOURCE db/fixtures/production/8_create_character_ability_list.sql; 
SOURCE db/fixtures/production/9_create_character_inventory.sql; 
