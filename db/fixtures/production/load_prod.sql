-- Run from repo root
SOURCE prod/schema.sql;

-- Load sample data
SOURCE prod/1_create_users.sql;
SOURCE prod/2_create_deltas.sql;
SOURCE prod/3_create_characters.sql;
SOURCE prod/4_create_spells.sql;
SOURCE prod/5_create_abilities.sql; 
SOURCE prod/6_create_items.sql;
SOURCE prod/7_create_character_spell_list.sql; 
SOURCE prod/8_create_character_ability_list.sql; 
SOURCE prod/9_create_character_inventory.sql; 
