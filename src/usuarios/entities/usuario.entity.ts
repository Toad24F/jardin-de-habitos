import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Le dice a TypeORM que esta clase es una tabla de BD
export class Usuario {
  
  @PrimaryGeneratedColumn() // Crea una columna "id" autoincremental (1, 2, 3...)
  id: number;

  @Column() // Crea una columna de tipo "varchar" (texto)
  nombre: string;

  // Puedes añadir más columnas aquí
  @Column({ nullable: true }) // Columna opcional
  email: string;

  @Column({ default: true }) // Columna con valor por defecto
  estaActivo: boolean;

  @Column({ select: false }) // 'select: false' es una BUENA PRÁCTICA
  password: string;         // para que el hash no se envíe en los GET
}