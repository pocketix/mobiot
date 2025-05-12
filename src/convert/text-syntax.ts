
export function TextSyntax(programText: string): { errorIndex: number | null, program: object | null } {
    try {
      const program = JSON.parse(programText);
      //On this place can be connected library for syntax check of JSON form of the program
      //For now, it will just check if the program is valid JSON
      return {
        errorIndex: null,
        program: program
      };
    } catch (error: any) {
      const message: string = error.message || '';
      const match = message.match(/line (\d+)/);
      const errorIndex = match ? parseInt(match[1], 10) : null;
  
      return {
        errorIndex: errorIndex,
        program: null
      };
    }
  }