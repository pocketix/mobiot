
let currentLang: LangCode = 'en';

export type LangCode = keyof typeof translations;

export let translations = {
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
    selectTypeOfVar: 'Type of variable: ',
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
    selectFromExist: 'Choose from existing',

    User: 'User',
    Device: 'Device',
    addVariable: 'Add variable',
    addValue: 'Add value',

    Compare: 'Compare',
    Logical: 'Logical',
    Numeric: 'Numeric',
    insertBlock: 'Insert next program block',//block of your program
    insertFirstBlock: 'Insert first program block',//of your program
    insertHere: 'Insert here',
    attentionIf: 'Attention: All (otherwise) and (else) blocks connected with this (if) block will be moved too. ',
    attentionIfDelete: 'Attention: All (else if) and (else) blocks connected with this (if) block will be deleted too. ',
    invalidAction: 'Invalid drag and drop. ',//action
    attentionVar: 'Attention: If you delete used variable, it makes error in your program. ',
    invalidName: 'Name already used. ',
    invalidImport: 'File not accepted: mistake in imported JSON. ',//Import program cannot be used. There is some mistake in imported JSON. 
    
    do: 'Do', 
    Repeat: 'Repeat',
    While: 'While',
    SendNotification: 'Send Notification',
    If: 'If',
    Else: 'Else',
    Otherwise: 'Otherwise',
    SwitchAccording: 'Switch According',
    Case: 'Case',
    EndOfBlock: 'End of Block',
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

    aboutText: 'This is VPL editor for automatization of smart devices on mobile phones. It was developed for project Pocketix by David Škrabal. This editor uses a block and form based visual programming language. For more information click ',
    here: 'here',
    helpText: 'The editor consists of three main parts: the menu, the program editor, and the offer section. The editor has two views: graphical and text. The view can be switched using the view button located in the menu.',
    graphicalView: 'Graphical view',
    graphicalViewText: 'The graphical view displays individual program blocks. Blocks can be moved using the drag-and-drop button located on the left side of each block. On desktop devices, it is necessary to click this button to reveal drop zones before dragging. Holding a block opens an action menu for that block. This menu includes options to delete, move, or replace the block. These actions are filtered based on context.',
    textView: 'Text view',
    textViewText: 'The text view displays the program in JSON format. Some changes can be made directly to the program here.',
    offerSection: 'Offer section',
    offerSectionText: 'Blocks are added to the program by clicking them in the offer section. This section includes a menu that filters available blocks by type.',
    settingsHelp: 'Settings',
    settingsText: 'There is also a button in the menu to open the settings window. In the settings, users can import/export programs, change the editor language, view variables and conditions, and access information about connected devices. Variables and conditions can be edited or deleted. To show the edit and delete buttons, click on the relevant item in the list. Expressions or conditions are created by adding operands, grouping them with the group button, and assigning an operation.',

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
    addFirstVar: 'Vložte první proměnnou, nebo hodnotu',// do své podmínky
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

    insertBlock: 'Vložte další blok ',//svého programu
    insertFirstBlock: 'Vložte první blok svého programu ',
    insertHere: 'Vložte zde',
    attentionIf: 'Upozornění: Všechny (jinak jestli) a (jinak) blocky propojené s tímto (pokud) blokem budou také přesunuty. ',
    attentionIfDelete: 'Upozornění: Všechny (jinak jestli) a (jinak) blocky propojené s tímto (pokud) blokem budou také smazány. ',
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
    aboutText: 'Toto je VPL editor pro automatizaci chytrých zařízení na mobilních telefonech. Byl vyvinut pro projekt Pocketix Davidem Škrabalem. Tento editor používá vizuální programovací jazyk založený na blocích a formulářích. Pro více informací klikněte ',
    here: 'zde',
    helpText: 'Editor se skládá ze tří hlavních částí: nabídky, samotného editoru a panelu s nabídkou bloků. Editor má dvě zobrazení: grafické a textové. Mezi těmito zobrazeními lze přepínat pomocí tlačítka v nabídce.',
    graphicalView: 'Grafické zobrazení',
    graphicalViewText: 'Grafické zobrazení obsahuje jednotlivé programové bloky. Bloky lze přesouvat pomocí tlačítka pro přetažení, které je umístěno na levé straně každého bloku. Na počítači je třeba na toto tlačítko nejprve kliknout, aby se zobrazila místa, kam lze blok přesunout. Podržením bloku se zobrazí nabídka akcí pro tento blok. Tato nabídka obsahuje možnosti pro smazání, přesun nebo nahrazení bloku. Dostupné akce jsou filtrovány podle kontextu.',
    textView: 'Textové zobrazení',
    textViewText: 'Textové zobrazení zobrazuje program ve formátu JSON. V tomto zobrazení lze provádět některé úpravy programu.',
    offerSection: 'Nabídka bloků',
    offerSectionText: 'Bloky se do programu přidávají kliknutím na ně v nabídce. Tato nabídka obsahuje filtr, který zobrazuje bloky podle typu.',
    settingsHelp: 'Nastavení',
    settingsText: 'V nabídce editoru je také tlačítko pro otevření okna nastavení. V nastavení je možné importovat/exportovat program, změnit jazyk editoru, zobrazit nebo upravit proměnné a podmínky a získat informace o připojených zařízeních. Proměnné a podmínky lze upravovat a mazat. Pro zobrazení tlačítek pro úpravu nebo mazání je třeba kliknout na příslužnou položku v seznamu. Výrazy nebo podmínky se vytvářejí přidáním operandů, jejich seskupením pomocí tlačítka pro seskupení a přiřazením operace.',
  }
};

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
}
  