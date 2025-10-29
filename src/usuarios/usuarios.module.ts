import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. Importa
import { Usuario } from './entities/usuario.entity'; // <-- 2. Importa tu entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]) // <-- 3. Añade esto
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}