import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { RegistroDia } from 'src/registros/entities/registro.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('habitos') // 'habitos' es el nombre de la tabla en PostgreSQL
export class Habito {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ type: 'varchar', length: 255 })
  nombre_habito: string;

  @Column({ type: 'int', default: 1 })
  frecuencia_diaria: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Etapa de crecimiento de la "mata" del hábito (0: Semilla, 1: Brote, 2: Planta joven, etc.)
  @Column({ type: 'int', default: 1 })
  etapa_mata: number;

  // Contador que decide si la mata crece o se deteriora (e.g., 3 para crecer, 0 para decaer).
  @Column({ type: 'int', default: 3 })
  calificador_crecimiento: number;
  // --- Relación con Usuario ---

  @Column() // Columna que guardará el FK
  id_usuario: string
  @ManyToOne(() => Usuario, (usuario) => usuario.habitos)
  @JoinColumn({ name: 'id_usuario' }) // Especifica que 'id_usuario' es el FK
  usuario: Usuario;

  @OneToMany(() => RegistroDia, (registroDia) => registroDia.habito)
  registros: RegistroDia[];
}