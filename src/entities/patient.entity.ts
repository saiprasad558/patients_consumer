import * as moment from 'moment';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryColumn()
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  gender: string;

  @Column()
  fullName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string | null;

  @Column({ nullable: true })
  bloodType: string | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ nullable: true })
  height: string | null;

  @Column({ nullable: true })
  weight: string | null;

  @Column({ nullable: true })
  heightType: string | null;

  @Column({ nullable: true })
  weightType: string | null;

  @Column({ nullable: true })
  imageUrl: string | null;

  @Column({ nullable: true })
  createdAt: Date | null;

  @Column({ nullable: true })
  updatedAt: Date | null;

  @Column()
  isExist: boolean;

  static dateFunction(date?: string) {
    if (date && !isNaN(Date.parse(date))) {
      return new Date(date);
    }
    return null;
  }
  static fromJSON(json: Record<string, any>): Patient {
    const patients = new Patient();
    patients.id = json?.uId;
    patients.bloodType = json?.bloodType;
    // patients.authId = json?.authId ?? '';
    patients.phoneNumber = json?.phoneNumber ?? '';
    patients.dateOfBirth = moment(json?.dob, 'YYYY-MM-DD', true).isValid()
      ? json?.dob
      : null;
    patients.email = json?.email;
    patients.height = json?.height;
    patients.weight = json?.weight;
    patients.heightType = json?.heightType;
    patients.weightType = json?.weightType;
    patients.imageUrl = json?.imageUrl;
    patients.gender = json?.gender ?? '';
    patients.fullName = json?.fullName ?? '';
    patients.createdAt = this.dateFunction(json?.createdAt) ?? null;
    patients.updatedAt = this.dateFunction(json?.updatedAt) ?? null;
    patients.isExist = json?.isExist ?? false;

    return patients;
  }
}
