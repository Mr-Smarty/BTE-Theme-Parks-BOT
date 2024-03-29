import { Column, ColumnOptions } from 'typeorm';

export default function SnowflakeColumn(options?: ColumnOptions): PropertyDecorator {
    return Column({ ...options, type: 'varchar', length: '19' });
}

// credit to cAtte_#4289
