import { Habito } from 'src/habitos/entities/habito.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('registros_dia')
@Index(['id_habito', 'fecha'], { unique: true }) // Asegura que solo haya un registro por hábito por día
export class RegistroDia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Fecha del registro. Usamos Date para almacenar solo el día (sin hora).
  @Column({ type: 'date' })
  fecha: Date;

  // Cuántas veces se realizó el hábito ese día.
  @Column({ type: 'int' })
  veces_realizadas: number;

  // Cómo se sintió el usuario al realizar el hábito.
  @Column({ type: 'varchar', length: 500, nullable: true })
  sentimiento: string;

  // Razón por la que se realizó o no el hábito.
  @Column({ type: 'text', nullable: true })
  motivo: string;

  // Qué tan difícil fue 
  @Column({ type: 'int' })
  dificultad: number;

  // --- Relaciones ---

  @Column({ type: 'uuid' }) // Columna que guarda el FK del hábito (UUID)
  id_habito: string;

  @ManyToOne(() => Habito, (habito) => habito.registros)
  @JoinColumn({ name: 'id_habito' })
  habito: Habito;

  @Column() // Columna que guarda el FK del usuario (uuid)
  id_usuario: string;

  @ManyToOne(() => Usuario, { eager: false }) // Relación solo para asegurar la propiedad
  @JoinColumn({ name: 'id_usuario' }) // Especifica que 'id_usuario' es el FK
  usuario: Usuario;
}