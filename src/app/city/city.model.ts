export class City {
  private _id: number;
  private _name: string;
  private _code: string;
  private _state_id: number;
  private _state: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get state_id(): number {
    return this._state_id;
  }

  set state_id(value: number) {
    this._state_id = value;
  }

  get state(): string {
    return this._state;
  }

  set state(value: string) {
    this._state = value;
  }
}
