import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { RegistroDia } from './entities/registro.entity';
import { Habito } from 'src/habitos/entities/habito.entity'; // Necesario para la lógica de la mata

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroDia, Habito]) // Importar ambas entidades
  ],
  controllers: [RegistrosController],
  providers: [RegistrosService],
})
export class RegistroDiaModule {}