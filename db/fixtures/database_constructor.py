import os
from dotenv import load_dotenv, find_dotenv
import openai
import random
import string
import json

# change these
numUsers = 10
numCharacters = 30
numSpells = 50
numItems = 50
numAbilities = 20 # note that this is specific to the number of unique abilities for characters, not items

characterMinAbilityNum = 1 # fewest number of abilities a character would have
characterMaxAbilityNum = 5 # greatest number of abilities a character would have
characterMinSpellNum = 0 # fewest number of spells a character would have
characterMaxSpellNum = 16 # greatest number of spells a character would have
characterMinItemNum = 0 # fewest number of spells a character would have
characterMaxItemNum = 20 # greatest number of spells a character would have

# don't change these
characterCount = 0
itemCount = 0
spellCount = 0
skillDeltaCount = 1
abilityCount = 1

load_dotenv(find_dotenv())
API_KEY = os.environ.get("API_KEY")

ai = openai.OpenAI(api_key=API_KEY)
instructions = [
    {"role": "system", "content": "meow"}
]

def generate_Users():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/1_create_users.sql", 'w')
    file.write("")
    file.close()
    file = open("prod/1_create_users.sql", 'a')
    usernameList = ['']
    username = ''
    for x in range(1, numUsers+1):
        while username in usernameList:
            username = ''.join(random.choice(string.ascii_lowercase) for i in range(5))   
        usernameList.append(username)
        password = random.randint(10000, 99999)
        file.write("INSERT INTO Users VALUES (%i, '%s', '%i');\n" % (x, username, password))
    file.close()
    
def clear_SkillDeltas():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/2_create_deltas.sql", 'w')
    file.write("")
    file.close()

def clear_Abilities():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/5_create_abilities.sql", 'w')
    file.write("")
    file.close()

def generate_Characters():
    global skillDeltaCount, characterCount
    os.makedirs("prod", exist_ok=True)
    charFile = open("prod/3_create_characters.sql", 'w')
    charFile.write("")
    charFile = open("prod/3_create_characters.sql", 'a')
    skillFile = open("prod/2_create_deltas.sql", 'a') # assumes create_deltas already exists
    data = []
    messages = []
    instructions = [
        {"role": "system", "content": "Generate data for a Dungeons and Dragons character database"},
        {"role": "system", "content": "Output 10 unique sample characters, and indicate the 'name', 'description', and 'stats'"},
        {"role": "system", "content": "The name can be any string of text"},
        {"role": "system", "content": "The description will be a breif sumarry of the character including level, class, race"},
        {"role": "system", "content":
        """
            The stats will be a list of numbers that correspond to the following in the same order:   
            base_armor_class INT NOT NULL DEFAULT 0,
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
            persuasion INT NOT NULL DEFAULT 0
        """
        },
        {"role": "system", "content": "The strength, dexterity, constitution, wisdom, intelligence, and charisma stats will be an integer 8-20"},
        {"role": "system", "content": "The non-base stat skills number will be the skill modifier, a positive or negative single digit number"},
        {"role": "system", "content": "The max health will be the characters maximum health, and the current health should be less than the maximum health"},
        {"role": "system", "content": "All skill values should be realistic for Dungeons and Dragons characters"},
        {"role": "system", "content": "Provide a wide range of unique characters, do not repeat any character names"},
        {"role": "system", "content": "The output will match the given specificications and must be able to be parsed as a JSON"},
        {"role": "system", "content": "Do not include any ` characters or the word json in the output, include only the list of characters"},
    ]
    for i in range(numCharacters//10):
        completion = ai.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=instructions
                        )
        messages += {"role": "assistant", "content": completion.choices[0].message.content.replace('’', "''")}

        # print(completion.choices[0].message.content.replace('’', "''"))
        data += json.loads(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        print((i+1)*1000/numCharacters,'%')
    for x in range(1, 1+len(data)):
        characterCount += 1
        current = data[x-1]
        charFile.write("INSERT INTO Characters VALUES (%i, '%s', '%s', %i, %i);\n" % (x, current["name"], current["description"], random.randint(1, numUsers), skillDeltaCount))
        skillDeltas = current["stats"]
        while len(skillDeltas) < 27:
            skillDeltas.append(0)
        while len(skillDeltas) > 27:
            skillDeltas.pop()
        skillFile.write("INSERT INTO SkillDeltas VALUES (%i, %s);\n"%(skillDeltaCount, str(skillDeltas)[1:-1]))
        skillDeltaCount += 1
    charFile.close()
    skillFile.close()

def generate_Spells():
    global skillDeltaCount, spellCount
    os.makedirs("prod", exist_ok=True)
    spellFile = open("prod/4_create_spells.sql", 'w')
    spellFile.write("")
    spellFile = open("prod/4_create_spells.sql", 'a')
    skillFile = open("prod/2_create_deltas.sql", 'a') # assumes create_deltas already exists
    data = []
    messages = []
    instructions = [
        {"role": "system", "content": "Generate data for a Dungeons and Dragons spell database"},
        {"role": "system", "content": "Output 10 unique sample spells (that may or may not be in the base game)"},
        {"role": "system", "content":
        """
            The format must match the following:   
            name: string
            level : integer (0-10 where 0 is a cantrip),
            description : string,
            duration : integer representing number of turns,
            casting_time : string (can be number of minutes, action, bonus action, or reaction with trigger),
            spell_range : string (can be self, touch, or number of feet eg. 60ft),
            components : string,
            skill_delta : array[integers] (can be empty if the spell does not affect any stats)
        """
        },
        {"role": "system", "content":
        """
            If the spell changes a stat, the skill_delta array must match the following format:   
            base_armor_class INT NOT NULL DEFAULT 0,
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
            persuasion INT NOT NULL DEFAULT 0
        """
        },
        {"role": "system", "content": "The changes_stats array will represent the change in each stat by the triggering of the spell, for example, a mage armor cast might have base_armor_class = 3 and the other stats 0. All stats must have a value."},
        {"role": "system", "content": "All skill values and effects should be realistic for Dungeons and Dragons gameplay"},
        {"role": "system", "content": "Provide a wide range of unique spells and spell effects"},
        {"role": "system", "content": "The output will match the given specificications and must be able to be parsed as a JSON"},
        {"role": "system", "content": "Do not include any ` characters or the word json in the output, include only the list of spells"},
    ]
    for i in range(numSpells//10):
        completion = ai.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=instructions
                        )
        messages += {"role": "assistant", "content": completion.choices[0].message.content.replace("'", "''").replace('’', "''")}

        # print(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        data += json.loads(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        print((i+1)*1000/numSpells,'%')
    for x in range(1, 1+len(data)):
        spellCount += 1
        current = data[x-1]
        skill_delta = data[x-1].get("skill_delta", [])
        hasSkill_delta = len(skill_delta) != 0 and set(str(v) for v in skill_delta) & set("123456789")
        spellFile.write("INSERT INTO Spells VALUES (%i, '%s', %i, '%s', %i, %s, '%s', '%s', '%s');\n" % (
            x, current["name"], current["level"], current["description"], current["duration"], 
            str(skillDeltaCount) if hasSkill_delta else "NULL", current["casting_time"], current["spell_range"], current["components"]
        ))
        if hasSkill_delta:
            skillDeltas = current["skill_delta"]
            while len(skillDeltas) < 27:
                skillDeltas.append(0)
            while len(skillDeltas) > 27:
                skillDeltas.pop()
            skillFile.write("INSERT INTO SkillDeltas VALUES (%i, %s);\n"%(skillDeltaCount, str(skillDeltas)[1:-1]))
            skillDeltaCount += 1
    spellFile.close()
    skillFile.close()

def generate_Abilities():
    global skillDeltaCount, abilityCount
    os.makedirs("prod", exist_ok=True)
    abilityFile = open("prod/6_create_items.sql", 'w')
    abilityFile.write("")
    abilityFile.close()
    abilityFile = open("prod/6_create_items.sql", 'a')
    abilityFile = open("prod/5_create_abilities.sql", 'a')
    skillFile = open("prod/2_create_deltas.sql", 'a')
    data = []
    messages = []
    instructions = [
        {"role": "system", "content": "Generate data for a Dungeons and Dragons character ability database"},
        {"role": "system", "content": "Output 10 unique sample abilities (that may or may not be in the base game)"},
        {"role": "system", "content":
        """
            The output must match the following format:    
            name - string,
            description - string,
            type - ENUM('non-action', 'action', 'bonus-action', 'reaction', 'free-action') ,
            skill_delta - Array (can be empty for abilities that do not change stats)
        """
        },
        {"role": "system", "content":
        """
            If the ability changes a stat of the user, the skill_delta array must match the following format:   
            base_armor_class INT NOT NULL DEFAULT 0,
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
            persuasion INT NOT NULL DEFAULT 0
        """
        },
        {"role": "system", "content": "The skill_delta array will represent the change in each stat by the use of the characters ability, for example, the use of some ability might have base_armor_class = 3 and the other stats 0. All stats must have a value."},
        {"role": "system", "content": "All skill values and effects should be realistic for Dungeons and Dragons gameplay"},
        {"role": "system", "content": "Provide a wide range of unique abilities and skill deltas"},
        {"role": "system", "content": "The output will match the given specificications and must be able to be parsed as a JSON"},
        {"role": "system", "content": "Do not include any ` characters or the word json in the output, include only the list of abilities"},
    ]
    for i in range(numAbilities//10):
        completion = ai.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=instructions
                        )
        messages += {"role": "assistant", "content": completion.choices[0].message.content.replace("'", "''").replace('’', "''")}

        # print(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        data += json.loads(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        print((i+1)*1000/numAbilities,'%')
    for x in range(1, 1+len(data)):
        abilityCount += 1
        current = data[x-1]
        skill_delta = current.get("skill_delta", [])
        hasSkill_delta = len(skill_delta) != 0 and set(str(v) for v in skill_delta) & set("123456789")
        abilityFile.write("INSERT INTO Abilities VALUES (%i, '%s', '%s', %s, '%s');\n" % (
            x, current["name"], current["description"], str(skillDeltaCount) if hasSkill_delta else "NULL", current["type"]
        ))
        if hasSkill_delta:
            skillDeltas = current["skill_delta"]
            while len(skillDeltas) < 27:
                skillDeltas.append(0)
            while len(skillDeltas) > 27:
                skillDeltas.pop()
            skillFile.write("INSERT INTO SkillDeltas VALUES (%i, %s);\n"%(skillDeltaCount, str(skillDeltas)[1:-1]))
            skillDeltaCount += 1
    abilityFile.close()
    skillFile.close()

def generate_Items():
    global skillDeltaCount, abilityCount, itemCount
    os.makedirs("prod", exist_ok=True)
    itemFile = open("prod/6_create_items.sql", 'w')
    itemFile.write("")
    itemFile.close()
    itemFile = open("prod/6_create_items.sql", 'a')
    abilityFile = open("prod/5_create_abilities.sql", 'a')
    skillFile = open("prod/2_create_deltas.sql", 'a')
    data = []
    messages = []
    instructions = [
        {"role": "system", "content": "Generate data for a Dungeons and Dragons item database"},
        {"role": "system", "content": "Output 10 unique sample items (that may or may not be in the base game)"},
        {"role": "system", "content":
        """
            The format must match the following:   
                name - string,
                description - string,
                ability - JSON dictionary (for items with no ability, assign "ability" : {})
        """
        },
        {"role": "system", "content":
        """
            For items with abilities, the ability array must match the following format:    
                name - string,
                description - string,
                type - ENUM('non-action', 'action', 'bonus-action', 'reaction', 'free-action') ,
                skill_delta - Array[integers] (can be empty for abilities that do not change stats)
        """
        },
        {"role": "system", "content":
        """
            If the ability changes a stat, the skill_delta array must match the following format:
            index 0 - base_armor_class INT NOT NULL DEFAULT 0,
            index 1 - current_health INT NOT NULL DEFAULT 0,
            index ... max_health INT NOT NULL DEFAULT 0,
            index ... strength INT NOT NULL DEFAULT 0,
            index ... dexterity INT NOT NULL DEFAULT 0,
            index ... intelligence INT NOT NULL DEFAULT 0,
            index ... wisdom INT NOT NULL DEFAULT 0,
            index ... charisma INT NOT NULL DEFAULT 0,
            index ... constitution INT NOT NULL DEFAULT 0,
            index ... athletics INT NOT NULL DEFAULT 0,
            index ... acrobatics INT NOT NULL DEFAULT 0,
            index ... sleight_of_hand INT NOT NULL DEFAULT 0,
            index ... stealth INT NOT NULL DEFAULT 0,
            index ... arcana INT NOT NULL DEFAULT 0,
            index ... history INT NOT NULL DEFAULT 0,
            index ... investigation INT NOT NULL DEFAULT 0,
            index ... nature INT NOT NULL DEFAULT 0,
            index ... religion INT NOT NULL DEFAULT 0,
            index ... animal_handling INT NOT NULL DEFAULT 0,
            index ... insight INT NOT NULL DEFAULT 0,
            index ... medicine INT NOT NULL DEFAULT 0,
            index ... perception INT NOT NULL DEFAULT 0,
            index ... survival INT NOT NULL DEFAULT 0,
            index ... deception INT NOT NULL DEFAULT 0,
            index ... intimidation INT NOT NULL DEFAULT 0,
            index ... performance INT NOT NULL DEFAULT 0,
            index ... persuasion INT NOT NULL DEFAULT 0
        """
        },
        {"role": "system", "content": "Not all items must have an ability, and not all abilities must have a skill delta"},
        {"role": "system", "content": "The skill_delta array will represent the change in each stat by the use of the item's ability, for example, the use of armor ability to equip might have base_armor_class = 3 and all other stats 0. All stats must have a value, which means a skill_delta array will have length=26 or length=0"},
        {"role": "system", "content": "All skill values and effects should be realistic for Dungeons and Dragons gameplay"},
        {"role": "system", "content": "Provide a wide range of unique items and item abilities"},
        {"role": "system", "content": "The output will match the given specificications and must be able to be parsed as a JSON"},
        {"role": "system", "content": "Do not include any ` characters or the word json in the output, include only the list of items"},
    ]
    for i in range(numItems//10):
        completion = ai.chat.completions.create(
                            model="gpt-4o-mini",
                            messages=instructions
                        )
        messages += {"role": "assistant", "content": completion.choices[0].message.content.replace("'", "''").replace('’', "''")}

        # print(completion.choices[0].message.content.replace("'", "''"))
        data += json.loads(completion.choices[0].message.content.replace("'", "''").replace('’', "''"))
        print((i+1)*1000/numItems,'%')
    for x in range(1,1+len(data)):
        itemCount += 1
        current = data[x-1]
        hasAbility = len(current["ability"]) != 0
        itemFile.write("INSERT INTO Items VALUES (%i, '%s', '%s', %s);\n" % (
            x, current["name"], current["description"], str(abilityCount) if hasAbility else "NULL"
        ))
        if hasAbility:
            skill_delta = current["ability"].get("skill_delta", [])
            hasSkill_delta = len(skill_delta) != 0 and set(str(v) for v in skill_delta) & set("123456789")
            abilityFile.write("INSERT INTO Abilities VALUES (%i, '%s', '%s', %s, '%s');\n" % (
                abilityCount, current["ability"]["name"], current["ability"]["description"], str(skillDeltaCount) if hasSkill_delta else "NULL", current["ability"]["type"]
            ))
            abilityCount += 1
            if hasSkill_delta:
                skillDeltas = current["ability"]["skill_delta"]
                while len(skillDeltas) < 27:
                    skillDeltas.append(0)
                while len(skillDeltas) > 27:
                    skillDeltas.pop()
                skillFile.write("INSERT INTO SkillDeltas VALUES (%i, %s);\n"%(skillDeltaCount, str(skillDeltas)[1:-1]))
                skillDeltaCount += 1
    itemFile.close()
    abilityFile.close()
    skillFile.close()

def give_spells():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/7_create_character_spell_list.sql", 'w')
    file.write("")
    file.close()
    file = open("prod/7_create_character_spell_list.sql", 'a')
    for x in range(1, 1+numCharacters):
        abilityList = []
        abilityNum = random.randint(1, spellCount)
        for y in range(random.randint(characterMinSpellNum, characterMaxSpellNum)):
            while abilityNum in abilityList:
                abilityNum = random.randint(1, spellCount)
            abilityList.append(abilityNum)
            file.write("INSERT INTO CharacterSpellList VALUES (%i, %i, %i);\n" % (x, abilityNum, random.randint(0, 3)))
    file.close()

def give_abilities():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/8_create_character_ability_list.sql", 'w')
    file.write("")
    file.close()
    file = open("prod/8_create_character_ability_list.sql", 'a')
    for x in range(1,1+characterCount):
        abilityList = []
        abilityNum = random.randint(1, numAbilities)
        for y in range(random.randint(characterMinAbilityNum, characterMaxAbilityNum)):
            while abilityNum in abilityList:
                abilityNum = random.randint(1, numAbilities)
            abilityList.append(abilityNum)
            useNum = random.randint(1, 6)
            file.write("INSERT INTO CharacterAbilities VALUES (%i, %i, %i, %i, %i);\n" % (x, abilityNum, random.randint(0,3), useNum, random.randint(0, useNum)))
    file.close()

def give_items():
    os.makedirs("prod", exist_ok=True)
    file = open("prod/9_create_character_inventory.sql", 'w')
    file.write("")
    file.close()
    file = open("prod/9_create_character_inventory.sql", 'a')
    for x in range(1, 1+numCharacters):
        abilityList = []
        abilityNum = random.randint(1, itemCount)
        for y in range(random.randint(characterMinSpellNum, characterMaxSpellNum)):
            while abilityNum in abilityList:
                abilityNum = random.randint(1, itemCount)
            abilityList.append(abilityNum)
            file.write("INSERT INTO CharacterInventory VALUES (%i, %i, %i, %i);\n" % (x, abilityNum, random.randint(1, 3), random.randint(0, 3)))
    file.close()

clear_SkillDeltas()
clear_Abilities()
print("Beginning user generation")
generate_Users()
print("User generation complete, starting character generation")
generate_Characters()
print("Character generation complete, starting spell generation")
generate_Spells()
print("Spell generation complete, starting ability generation")
generate_Abilities()
print("Ability generation complete, starting item generation")
generate_Items()
print("Item generation complete, starting spell, ability, and item assignment")
give_spells()
give_abilities()
give_items()
print("All tables complete")
