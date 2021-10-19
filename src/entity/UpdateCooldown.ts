import { BaseEntity, Entity } from 'typeorm';
import SnowflakePrimaryColumn from './decorators/SnowflakePrimaryColumn';

@Entity()
export class UpdateCooldown extends BaseEntity {
    @SnowflakePrimaryColumn()
    member: string;
}
