import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, IsUUID, IsDate } from 'class-validator';

export class CreateRegistroDiaDto {
  @IsUUID()
  @IsNotEmpty()
  id_habito: string; // El UUID del hábito al que pertenece el registro

  @IsInt()
  @IsNotEmpty({ message: 'Indica cuántas veces se realizó el hábito.' })
  @Min(0, { message: 'Las veces realizadas deben ser al menos 0.' })
  veces_realizadas: number; // Cuántas veces lo hiciste ese día

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El sentimiento es obligatorio si se incluye.' })
  sentimiento?: string; // Como te sentiste

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El motivo es obligatorio si se incluye.' })
  motivo?: string; // Por qué lo hiciste

  @IsInt()
  @IsNotEmpty({ message: 'La dificultad es obligatoria.' })
  @Min(1, { message: 'La dificultad debe ser al menos 1.' })
  @Max(5, { message: 'La dificultad no debe ser mayor a 5.' }) // Asumimos una escala de 1 a 5
  dificultad: number;
  
}