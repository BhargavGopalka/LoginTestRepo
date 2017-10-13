export class State {
  private _id: number;
  private _state: string;
  private _code: string;
  private _country_id: number;
  private _country: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get state(): string {
    return this._state;
  }

  set state(value: string) {
    this._state = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get country_id(): number {
    return this._country_id;
  }

  set country_id(value: number) {
    this._country_id = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }
}
