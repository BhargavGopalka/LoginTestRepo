export class Country {

  private _id: number;
  private _code: string;
  private _country: string;
  private _dialing_code: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get dialing_code(): string {
    return this._dialing_code;
  }

  set dialing_code(value: string) {
    this._dialing_code = value;
  }

}
