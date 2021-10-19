import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './Project';

@Entity()
export class SubProject extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Project, project => project.subProjects, { nullable: false })
    parentProject: Project;
}
