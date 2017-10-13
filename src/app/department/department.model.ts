export class Department {
  private _id: number;
  private _department: string;
  private _org_id: number;
  private _organization: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
  }

  get org_id(): number {
    return this._org_id;
  }

  set org_id(value: number) {
    this._org_id = value;
  }

  get organization(): string {
    return this._organization;
  }

  set organization(value: string) {
    this._organization = value;
  }
}
