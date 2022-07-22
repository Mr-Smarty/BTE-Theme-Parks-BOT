import { PrimaryColumn, ColumnOptions, PrimaryColumnOptions } from 'typeorm';

export default function SnowflakePrimaryColumn(
    options?: ColumnOptions
): PropertyDecorator {
    return PrimaryColumn({
        ...options,
        type: 'varchar',
        length: '19'
    } as PrimaryColumnOptions);
}

// credit to cAtte_#4289
