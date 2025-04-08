
export function TextSyntax(programText: string): { errorIndex: number | null, program: object | null } {//TODO syntax control 5th phase
    try {
      const program = JSON.parse(programText);
      return {
        errorIndex: null,
        program: program
      };
    } catch (error: any) {
      const message: string = error.message || '';
      const match = message.match(/at position (\d+)/);
      const errorIndex = match ? parseInt(match[1], 10) : null;
  
      return {
        errorIndex: errorIndex,
        program: null
      };
    }
  }