export class Location {

  private _id: number;
  private _org_id: number;
  private _country_id: number;
  private _state_id: number;
  private _city_id: number;
  private _street: string;
  private _postal_code_id: number;
  private _organization: string;
  private _country: string;
  private _state: string;
  private _city: string;
  private _postal_code: number;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get org_id(): number {
    return this._org_id;
  }

  set org_id(value: number) {
    this._org_id = value;
  }

  get country_id(): number {
    return this._country_id;
  }

  set country_id(value: number) {
    this._country_id = value;
  }

  get state_id(): number {
    return this._state_id;
  }

  set state_id(value: number) {
    this._state_id = value;
  }

  get city_id(): number {
    return this._city_id;
  }

  set city_id(value: number) {
    this._city_id = value;
  }

  get street(): string {
    return this._street;
  }

  set street(value: string) {
    this._street = value;
  }

  get postal_code_id(): number {
    return this._postal_code_id;
  }

  set postal_code_id(value: number) {
    this._postal_code_id = value;
  }

  get organization(): string {
    return this._organization;
  }

  set organization(value: string) {
    this._organization = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get state(): string {
    return this._state;
  }

  set state(value: string) {
    this._state = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

  get postal_code(): number {
    return this._postal_code;
  }

  set postal_code(value: number) {
    this._postal_code = value;
  }
}
