import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Habito } from 'src/habitos/entities/habito.entity';
@Entity() // Le dice a TypeORM que esta clase es una tabla de BD
export class Usuario {
  
  @PrimaryGeneratedColumn("uuid") // Crea una columna "uuid" como clave primaria
  id: string; 

  @Column() // Crea una columna de tipo "varchar" (texto)
  nombre: string;

  @Column({ nullable: false }) // Columna opcional
  email: string;

  @Column({ default: true }) // Columna con valor por defecto
  estaActivo: boolean;

  @Column({ select: false }) // Columna que NO se selecciona por defecto
  password: string;         // para que el hash no se envíe en los GET
  /**
   * Un Usuario puede tener muchos Habitos.
   * La entidad 'Habito' se relaciona con esta entidad
   * a través de su propiedad 'usuario'.
   */
  @OneToMany(() => Habito, (habito) => habito.usuario)
  habitos: Habito[]; // 
}