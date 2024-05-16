export class Birthdate {
  public value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  static createFromText(value: string) {
    const dateRegex = /^(\d{2})(\d{2})(\d{4})$/;
    const match = dateRegex.exec(value);

    if (!match) {
      throw new Error("Data inválida. A data deve estar no formato: DDMMYYYY.");
    }

    const [, day, month, year] = match;
    const parsedDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Data inválida (pós-formatação).");
    }

    return new Birthdate(parsedDate);
  }
}
