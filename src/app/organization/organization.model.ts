export class Organization {
  private _id: number;
  private _name: string;
  private _apps: Apps[];
  private _checked: boolean;

  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
  }

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

  get apps(): Apps[] {
    return this._apps;
  }

  set apps(value: Apps[]) {
    this._apps = value;
  }
}

export class Apps {
  private _id: number;
  private _description: string;
  private _url: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get pivot(): Pivot {
    return this._pivot;
  }

  set pivot(value: Pivot) {
    this._pivot = value;
  }

  private _pivot: Pivot;
}

export class Pivot {
  private _org_id: number;
  private _app_id: number;

  get org_id(): number {
    return this._org_id;
  }

  set org_id(value: number) {
    this._org_id = value;
  }

  get app_id(): number {
    return this._app_id;
  }

  set app_id(value: number) {
    this._app_id = value;
  }
}
