import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { RegistroDia } from './entities/registro.entity';
import { Habito } from 'src/habitos/entities/habito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroDia, Habito])
  ],
  controllers: [RegistrosController],
  providers: [RegistrosService],
})
export class RegistroDiaModule {}