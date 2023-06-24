import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Patients {
  @PrimaryColumn()
  uId: string;

  @Column()
  bloodType: string;

  @Column()
  authId: string;


  @Column()
  phoneNumber: string;

  @Column()
  gender: string;

  @Column()
  fullName: string;

  @Column()
  dob: Date;

  @Column()
  email: string;

  @Column()
  height: string;

  @Column()
  weight: string;

  @Column()
  heightType: string;

  @Column()
  weightType: string;

  @Column()
  imageUrl: string;

  static dateFunction (date?:string) {
    if(date &&!isNaN(Date.parse(date)) ){
     return new Date(date)
    }
    return null
 }
  static fromJSON(json: Record<string, any>): Patients {
    const patients = new Patients();
    patients.uId = json?.uId;
    patients.bloodType = json?.bloodType ?? "";
    patients.authId = json?.authId ?? "";
    patients.phoneNumber = json?.phoneNumber ?? "";
    patients.dob = this.dateFunction(json?.dob);
    patients.email = json?.email ?? "";
    patients.height = json?.height ?? "";
    patients.weight = json?.weight ?? "";
    patients.heightType = json?.heightType ?? "";
    patients.weightType = json?.weightType ?? "";
    patients.imageUrl = json?.imageUrl ?? "";
    patients.gender = json?.gender ?? "";
    patients.fullName = json?.fullName ?? "";

    return patients;
  }
}
