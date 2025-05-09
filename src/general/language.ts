
let currentLang: LangCode = 'en';

// export type LangCode = 'en' | 'cs';
export type LangCode = keyof typeof translations;

export let translations = {//: Record<LangCode, Record<string, string>>
  en: {
    Graphical: 'Graphical',
    Both: 'Both', 
    Text: 'Text',
    chooseEditor: 'Choose editor:',

    settings: 'Settings',
    usersFactors: 'Users factors',
    importJSONfile: 'Import JSON file',
    exportJSONfile: 'Export JSON file',
    chooseLanguage: '🌐Choose language:',
    procedures: 'Procedures', 
    variables: 'Variables',
    conditions: 'Conditions',
    devicesFactors: 'Devices factors',
    commands: '⚡Commands',
    parameters: '🌡️Parameters',
    about: 'About',
    help: '? Help',


    save: 'Save',
    back: 'Back',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',

    listOfVariables: 'List of variables',
    type: 'Type',
    name: 'Name',
    value: 'Value',
    newVariable: 'New variable',

    number: '🔢 number',
    text: '🔤 text', 
    bool: '✅ bool',
    expr: '🧮 expr',
    true: 'true',
    false: 'false',
    enterNumber: 'Enter number',
    addVarVal: 'Variable value...',
    selectTypeOfVar: 'Select type of variable: ',
    addVarName: 'Variable name...',

    listOfConditions: 'List of conditions',
    newCondition: 'New condition',
    conditionEditor: '⚖️Condition Editor',
    fillNameOfNewCondition: 'Name of condition:',
    addName: 'Conditionn name ...',
    addFirstVar: 'Add first variable or value',// to your condition
    select: 'Select...',
    saveCondition: 'Save condition',
    group: 'Group',
    useValue: 'Use value',
    selectFromExist: 'Select one from exist',

    User: 'User',
    Device: 'Device',
    addVariable: 'Add variable',
    addValue: 'Add value',

    Compare: 'Compare',
    Logical: 'Logical',
    Numeric: 'Numeric',
    insertBlock: 'Insert next program block',//block of your program
    insertFirstBlock: 'Insert first program block of your program',//of your program
    insertHere: 'Insert here',
    attentionIf: 'Attention: All (else if) and (else) blocks connected with this (if) block will be moved too. ',
    attentionIfDelete: 'Attention: All (else if) and (else) blocks connected with this (if) block will be deleted too. ',
    invalidAction: 'Invalid drag and drop. ',//action
    attentionVar: 'Attention: If you delete used variable, it makes error in your program. ',
    invalidName: 'Name already used. ',
    invalidImport: 'File not accepted: mistake in imported JSON. ',//Import program cannot be used. There is some mistake in imported JSON. 
    
    do: 'do', 
    Repeat: 'Repeat',
    While: 'While',
    SendNotification: 'Send notification',
    If: 'If',
    Else: 'Else',
    Otherwise: 'Otherwise',
    SwitchAccording: 'Switch According',
    Case: 'Case',
    EndOfBlock: 'End of block',
    SetVariable: 'Set Variable',

    showBlock: 'Show block contend',
    hideBlock: 'Hide block contend',
    addArgument: 'Add argument: ',
    cond: 'cond. ',
    hide: 'Hide',
    arguments: 'Arguments ...',
    replace: 'Replace',
    saveAsProcedure: 'Save as procedure',
    changeValue: 'Change value: ',
    useVariable: 'Use variable: ',
    addVal: 'Add value',

    branch: 'branch',
    all: 'all',
    dev: 'dev',
    others: 'others',
    cycle: 'cycle',
    clickCreate: 'Create new expression',

    KPI: '📊 KPI',
    leaking: 'Leaking',
    turnedOn: 'Turned on',
    deviceOnline: 'Devices online',
    criticalBatery: 'Critical battery',
    anomalyDetected: 'Anomaly detected',
    sensorError: 'Sensor error',

  },
  cs: {
    Graphical: 'Grafický',
    Both: 'Oba', 
    Text: 'Text',
    chooseEditor: 'Vyberte editor:',

    settings: 'Nastavení',
    usersFactors: 'Uživatelské faktory',
    importJSONfile: 'Import soubor',
    exportJSONfile: 'Export soubor',
    chooseLanguage: '🌐Zvol jazyk:',
    procedures: 'Procedury', 
    variables: 'Proměnné',
    conditions: 'Podmínky',
    devicesFactors: ' Factory zařízení',
    commands: '⚡Příkazy',
    parameters: '🌡️Parametry',
    about: 'O projektu',
    help: '? Nápověda',

    save: 'Uložit',
    back: 'Zpět',
    cancel: 'Zrušit',
    edit: 'Upravit',
    delete: 'Smazat',

    listOfVariables: 'Seznam proměnných',
    type: 'Typ',
    name: 'Jméno',
    value: 'Hodnota',
    newVariable: 'Nová proměnná',

    number: '🔢 číslo',
    text: '🔤 text', 
    bool: '✅ bool',
    expr: '🧮 výraz',
    true: 'pravda',
    false: 'nepravda',
    enterNumber: 'Vlož číslo',
    addVarVal: 'Vlož hodnotu proměnné ...',
    selectTypeOfVar: 'Vložte typ proměnné: ',
    addVarName: 'Vložte jméno proměnné...',

    listOfConditions: 'Seznam podmínek',
    newCondition: 'Nová podmínka',
    conditionEditor: '⚖️Editor podmínek',
    fillNameOfNewCondition: 'Jméno podmínky:',
    addName: 'Vložte jméno ...',
    addFirstVar: 'Vložte první proměnnou, nebo hodnotu do své podmínky',
    select: 'Vybrat...',
    saveCondition: 'Uložit podmínku',
    group: 'Seskupit',
    useValue: 'Použít hodnotu',
    selectFromExist: 'Vyber jeden z existujících',

    User: 'Uživatelské',
    Device: 'Zařízení',
    addVariable: 'Přidat proměnnou',
    addValue: 'Přidat hodnotu',

    Compare: 'Porovnávací',
    Logical: 'Logické',
    Numeric: 'Číselné',

    insertBlock: 'Vložte další blok svého programu ',
    insertFirstBlock: 'Vložte první blok svého programu ',
    insertHere: 'Vložte zde',
    attentionIf: 'Upozornění: Všechny (else if) a (else) blocky propojené s tímto (if) blokem budou také přesunuty. ',
    attentionIfDelete: 'Upozornění: Všechny (else if) a (else) blocky propojené s tímto (if) blokem budou také smazány. ',
    invalidAction: 'Chybná drag and drop akce. ',
    attentionVar: 'Upozornění: Pokud smažete používanou proměnnou, vznikne chyba v programu. ',
    invalidName: 'Proměnná s tímto jménem již existuje. ',
    invalidImport: 'Nelze importovat. Byla nalezena chyba ve vstupním JSON. ',

    do: 'proveď', 
    Repeat: 'Opakuj',
    While: 'Dokud',
    SendNotification: 'Pošli zprávu',
    If: 'Pokud',
    Else: 'Jinak',
    Otherwise: 'Nebo jestli',
    SwitchAccording: 'Vyber podle',
    Case: 'Možnost',
    EndOfBlock: 'Konec bloku',
    SetVariable: 'Nastav proměnnou',

    showBlock: 'Zobraz blok',
    hideBlock: 'Skryj blok',
    addArgument: 'Přidej argument: ',
    cond: 'podm. ',
    hide: 'Skryj',
    arguments: 'Argumenty ...',
    replace: 'Nahradit',
    saveAsProcedure: 'Uložit jako proceduru',
    changeValue: 'Změn hodnotu:  ',
    useVariable: 'Použij proměnnou: ',
    addVal: 'Vlož hodnotu',

    branch: 'větvení',
    all: 'vše',
    dev: 'zařízení',
    others: 'jiné',
    cycle: 'cykly',
    clickCreate: 'Vytvoření nového výrazu',

    KPI: '📊 KPI',
    leaking: 'Únik detekován',
    turnedOn: 'Zapnutá zařízení',
    deviceOnline: 'Zařízení online',
    criticalBatery: 'Kritická baterie',
    anomalyDetected: 'Zjištěna anomálie',
    sensorError: 'Chyba senzoru',

  }
};

// export function transl(key: string): string {
//   return translations[currentLang][key] || key;
// }

export type TranslationKey = keyof typeof translations[LangCode];

export function transl(key: string): string {
  return translations[currentLang]?.[key as keyof typeof translations[typeof currentLang]] ?? key;
}

export function setLang(lang: LangCode) {
  currentLang = lang;
}

export function getLang(): LangCode {
  return currentLang;
}

export function updateTranslations(newData: typeof translations) {
  translations = newData;
  // type LangCode = keyof typeof translations;
}
  