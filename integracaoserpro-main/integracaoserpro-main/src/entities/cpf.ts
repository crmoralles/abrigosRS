type Situation = { code: 0; description: "Regular" };

type CPFProps = {
  number: string;
  situation: Situation;
};

export class CPF {
  protected props: CPFProps;

  constructor(props: CPFProps) {
    this.props = props;
  }

  static create(props: CPFProps) {
    const cpf = new CPF({ ...props });

    return cpf;
  }

  get number() {
    return this.props.number;
  }

  set number(number: string) {
    this.props.number = number;
  }

  get situation() {
    return this.props.situation;
  }

  set situation(situation: CPFProps["situation"]) {
    this.props.situation = situation;
  }
}
