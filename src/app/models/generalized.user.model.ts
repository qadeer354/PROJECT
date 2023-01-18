export class GeneralizedUser {
  id: string | undefined;
  name: string | undefined;
  photoUrl: string | undefined;

  constructor(id:string,name:string,photoUrl :string){
    this.id = id;
    this.name = name;
    this.photoUrl = photoUrl;
  }
}
